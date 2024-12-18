// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ConsoleExperienceFrame} from './frame/console-experience-frame';
import {
    ConsoleContentOptions,
    InternalConsoleExperience,
    IConsoleExperience,
    TransformedConsoleContentOptions,
} from './types';
import {ControlOptions} from '../control-experience';
import {ExperienceType, FrameOptions} from '@experience/base-experience/types';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {ChangeEvent, EmbeddingMessageEvent, ResponseMessage} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import {ExperienceFrameMetadata} from 'src/common';

export class ConsoleExperience extends BaseExperience<
    ConsoleContentOptions,
    InternalConsoleExperience,
    IConsoleExperience,
    TransformedConsoleContentOptions,
    ConsoleExperienceFrame
> {
    protected experience;
    protected internalExperience;
    protected experienceId;
    protected experienceFrame;
    protected currentPage: string | undefined;

    constructor(
        frameOptions: FrameOptions,
        contentOptions: ConsoleContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        super(frameOptions, contentOptions, controlOptions, experienceIdentifiers);

        this.experience = this.extractExperienceFromUrl(frameOptions.url);

        const {experienceIdentifier, internalExperience} = this.getInternalExperienceInfo<
            InternalConsoleExperience,
            IConsoleExperience
        >(this.experience);

        this.internalExperience = internalExperience;
        this.experienceId = experienceIdentifier;

        const {
            locale,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage,
        } = contentOptions;

        const transformedContentOptions = this.transformConsoleContentOptions(contentOptions);

        this.experienceFrame = new ConsoleExperienceFrame(
            frameOptions,
            controlOptions,
            contentOptions,
            transformedContentOptions,
            internalExperience,
            experienceIdentifier,
            this.interceptMessage
        );
        this.currentPage = 'START';
    }

    createSharedView = async (): Promise<ResponseMessage> => {
        if (
            this.currentPage !== 'DASHBOARD' &&
            this.currentPage !== 'DASHBOARD_SHEET' &&
            this.currentPage !== 'DASHBOARD_VIEW'
        ) {
            throw new Error('Cannot call createSharedView from this page');
        }
        const response = await this.send(new EmbeddingMessageEvent(MessageEventName.CREATE_SHARED_VIEW));
        if (!response?.message) {
            throw new Error('Failed to create shared view');
        }

        return response;
    };

    toggleExecutiveSummaryPane = async (): Promise<ResponseMessage> => {
        if (this.currentPage !== 'DASHBOARD') {
            throw new Error('Cannot call toggleExecutiveSummaryPane from this page');
        }
        return this.send(new EmbeddingMessageEvent(MessageEventName.TOGGLE_EXECUTIVE_SUMMARY_PANE));
    };

    openDataQnAPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.OPEN_DATA_QNA_PANE));
    };

    openBuildVisualPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.OPEN_BUILD_VISUAL_PANE));
    };

    private interceptMessage = (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
        if (messageEvent.eventName === MessageEventName.PAGE_NAVIGATION) {
            this.currentPage = messageEvent?.message?.pageType;
        }
    };

    protected extractExperienceFromUrl = (url: string): IConsoleExperience => {
        const matches: Array<string> =
            /^https:\/\/[^/]+\/embedding\/[^/]+\/(start(\/(favorites|dashboards|analyses))?|dashboards\/[\w-]+(\/views\/[\w-]+)?|analyses\/[\w-]+)(\?|$)/i.exec(
                url
            ) || [];

        if (matches.length < 5) {
            this.frameOptions.onChange?.(
                new ChangeEvent(ChangeEventName.INVALID_URL, ChangeEventLevel.ERROR, 'Invalid console experience url', {
                    url,
                }),
                {frame: this.experienceFrame.iframe}
            );

            throw new Error('Invalid console experience URL');
        }

        return {
            experienceType: ExperienceType.CONSOLE,
        };
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    private transformConsoleContentOptions = (contentOptions: ConsoleContentOptions) => {
        const {
            locale,
            toolbarOptions,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const transformedContentOptions = this.transformContentOptions<TransformedConsoleContentOptions>(
            {
                locale,
            },
            unrecognizedContentOptions
        );

        if (toolbarOptions?.executiveSummary === true) {
            transformedContentOptions.showExecutiveSummaryIcon = true;
        }

        if (toolbarOptions?.dataQnA === true) {
            transformedContentOptions.showDataQnAIcon = true;
        }

        if (toolbarOptions?.buildVisual === true) {
            transformedContentOptions.showBuildVisualIcon = true;
        }

        return transformedContentOptions;
    };
}
