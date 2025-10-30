// Copyright 2025 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {QuickChatExperienceFrame} from './frame/quick-chat-experience-frame';
import {
    IQuickChatExperience,
    InternalQuickChatExperience,
    QuickChatContentOptions,
    TransformedQuickChatContentOptions,
} from './types';
import {ExperienceType, FrameOptions} from '../base-experience';
import {ControlOptions} from '../control-experience';

import {ExperienceFrameMetadata} from '../../common/embedding-context';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {ChangeEvent, EmbeddingMessageEvent} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';

export class QuickChatExperience extends BaseExperience<
    QuickChatContentOptions,
    InternalQuickChatExperience,
    IQuickChatExperience,
    TransformedQuickChatContentOptions,
    QuickChatExperienceFrame
> {
    protected readonly experience;
    protected readonly internalExperience;
    protected readonly experienceFrame;
    protected readonly experienceId: string;

    constructor(
        frameOptions: FrameOptions,
        contentOptions: QuickChatContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        super(frameOptions, contentOptions, controlOptions, experienceIdentifiers);

        this.experience = this.extractExperienceFromUrl(frameOptions.url);

        const {experienceIdentifier, internalExperience} = this.getInternalExperienceInfo<
            InternalQuickChatExperience,
            IQuickChatExperience
        >(this.experience);

        this.internalExperience = internalExperience;
        this.experienceId = experienceIdentifier;

        this.experienceFrame = new QuickChatExperienceFrame(
            frameOptions,
            controlOptions,
            contentOptions,
            this.transformQuickChatContentOptions(contentOptions),
            internalExperience,
            experienceIdentifier
        );
    }

    protected extractExperienceFromUrl = (url: string): IQuickChatExperience => {
        const matches: Array<string> = /^https:\/\/[^/]+\/embedding\/[^/]+\/quick\/chat(\/|\?|$)/i.exec(url) || [];
        if (matches.length < 2) {
            this.frameOptions.onChange?.(
                new ChangeEvent(
                    ChangeEventName.INVALID_URL,
                    ChangeEventLevel.ERROR,
                    'Invalid quick chat experience url',
                    {
                        url,
                    }
                ),
                {frame: null}
            );

            throw new Error('Invalid quick chat experience url');
        }

        return {
            experienceType: ExperienceType.QUICKCHAT,
        };
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    private transformQuickChatContentOptions = (contentOptions: QuickChatContentOptions) => {
        const {
            fixedAgentArn,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage, // excluded from unrecognized
            ...unrecognizedContentOptions
        } = contentOptions;

        const transformedContentOptions = this.transformContentOptions<TransformedQuickChatContentOptions>(
            {
                fixedAgentArn,
            },
            unrecognizedContentOptions
        );

        return transformedContentOptions;
    };
}
