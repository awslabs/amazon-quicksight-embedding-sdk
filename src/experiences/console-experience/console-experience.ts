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
            ...unrecognizedContentOptions
        } = contentOptions;

        const transformedContentOptions = this.transformContentOptions<TransformedConsoleContentOptions>(
            {locale},
            unrecognizedContentOptions
        );

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
}
