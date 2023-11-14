// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {FrameOptions, TransformedContentOptions, ExperienceType} from '../base-experience';
import {
    InternalVisualExperience,
    TransformedVisualContentOptions,
    IVisualExperience,
    VisualContentOptions,
} from './types';
import {Parameter, ParametersAsObject} from '../../common';
import {VisualExperienceFrame} from './frame/visual-experience-frame';
import {ControlOptions} from '../control-experience';
import {VisualAction} from '../dashboard-experience';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {ChangeEvent, EmbeddingMessageEvent, ResponseMessage} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import {ExperienceFrameMetadata} from '@common/embedding-context/types';
import type {FilterGroup, ThemeConfiguration} from '@aws-sdk/client-quicksight';

export class VisualExperience extends BaseExperience<
    VisualContentOptions,
    InternalVisualExperience,
    IVisualExperience,
    TransformedContentOptions,
    VisualExperienceFrame
> {
    protected experience: IVisualExperience;
    protected internalExperience: InternalVisualExperience;
    protected experienceFrame: VisualExperienceFrame;
    protected experienceId: string;

    constructor(
        frameOptions: FrameOptions,
        contentOptions: VisualContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        super(frameOptions, contentOptions, controlOptions, experienceIdentifiers);

        this.experience = this.extractExperienceFromUrl(frameOptions.url);

        const {experienceIdentifier, internalExperience} = this.getInternalExperienceInfo<
            InternalVisualExperience,
            IVisualExperience
        >(this.experience);

        this.internalExperience = internalExperience;
        this.experienceId = experienceIdentifier;

        this.experienceFrame = new VisualExperienceFrame(
            frameOptions,
            controlOptions,
            contentOptions,
            this.transformVisualContentOptions(contentOptions),
            internalExperience,
            experienceIdentifier,
            this.interceptMessage
        );
    }

    setParameters = async (parameters: Parameter[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.SET_PARAMETERS, parameters));
    };

    reset = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.RESET));
    };

    addFilterGroups = async (filterGroups: FilterGroup[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.ADD_FILTER_GROUPS, filterGroups));
    };

    updateFilterGroups = async (filterGroups: FilterGroup[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.UPDATE_FILTER_GROUPS, filterGroups));
    };

    removeFilterGroups = async (filterGroups: FilterGroup[] | string[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.REMOVE_FILTER_GROUPS, filterGroups));
    };

    getFilterGroups = async (): Promise<FilterGroup[]> => {
        const response = await this.send<FilterGroup[]>(
            new EmbeddingMessageEvent(MessageEventName.GET_FILTER_GROUPS_FOR_VISUAL)
        );

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve filter groups for the visual');
        }

        return response.message;
    };

    getActions = async (): Promise<VisualAction[]> => {
        const response = await this.send<VisualAction[]>(
            new EmbeddingMessageEvent(MessageEventName.GET_VISUAL_ACTIONS)
        );

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve the actions');
        }

        return response.message;
    };

    addActions = async (actions: VisualAction[]): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.ADD_VISUAL_ACTIONS, {
                Actions: actions,
            })
        );
    };

    setActions = async (actions: VisualAction[]): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_VISUAL_ACTIONS, {
                Actions: actions,
            })
        );
    };

    removeActions = async (actions: VisualAction[]): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.REMOVE_VISUAL_ACTIONS, {
                Actions: actions,
            })
        );
    };

    setTheme = async (themeArn: string): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.SET_THEME, {ThemeArn: themeArn}));
    };

    setThemeOverride = async (themeOverride: ThemeConfiguration): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_THEME_OVERRIDE, {
                ThemeOverride: themeOverride,
            })
        );
    };

    protected extractExperienceFromUrl = (url: string): IVisualExperience => {
        const matches: Array<string> =
            /^https:\/\/[^/]+\/embed\/[^/]+\/dashboards\/([\w-]+)\/sheets\/([\w-]+)\/visuals\/([\w-]+)(\?|$)/i.exec(
                url
            ) || [];

        if (matches.length < 5) {
            this.frameOptions.onChange?.(
                new ChangeEvent(ChangeEventName.INVALID_URL, ChangeEventLevel.ERROR, 'Invalid visual experience url', {
                    url,
                }),
                {frame: this.experienceFrame.iframe}
            );

            throw new Error('Invalid visual experience URL');
        }

        return {
            experienceType: ExperienceType.VISUAL,
            dashboardId: matches[1],
            sheetId: matches[2],
            visualId: matches[3],
        };
    };

    private interceptMessage = (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
        // Intercepting onMessage
        // if the resizeHeightOnSizeChangedEvent is true, upon receiving SIZE_CHANGED message, update the height of the iframe
        if (messageEvent.eventName === 'SIZE_CHANGED' && this.frameOptions.resizeHeightOnSizeChangedEvent) {
            metadata?.frame?.setAttribute?.('height', `${messageEvent.message?.height}px`);
        }
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    private transformVisualContentOptions = (contentOptions: VisualContentOptions) => {
        const {
            fitToIframeWidth,
            locale,
            parameters,
            themeOptions,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const transformedContentOptions = this.transformContentOptions<TransformedVisualContentOptions>(
            {
                fitToIframeWidth: fitToIframeWidth ?? true,
                locale,
            },
            unrecognizedContentOptions
        );

        if (Array.isArray(parameters)) {
            transformedContentOptions.parameters = parameters.reduce(
                (parametersAsObject: ParametersAsObject, parameter: Parameter) => {
                    return {
                        ...parametersAsObject,
                        [parameter.Name]: parameter.Values,
                    };
                },
                {}
            );
        }

        if (themeOptions?.themeArn) {
            transformedContentOptions.themeArn = themeOptions.themeArn;
        }

        return transformedContentOptions;
    };
}
