// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ExperienceType, FrameOptions} from '../base-experience';
import {
    InternalQSearchExperience,
    IQSearchExperience,
    QSearchContentOptions,
    TransformedQSearchContentOptions,
} from './types';
import {FrameStyles} from '@experience/internal-q-base-experience/types';
import {QSearchExperienceFrame} from './frame/q-search-experience-frame';
import {ControlOptions} from '../control-experience';
import {InternalQBaseExperience} from '@experience/internal-q-base-experience/internal-q-base-experience';
import {ChangeEvent} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import {ExperienceFrameMetadata} from '@common/embedding-context/types';

export class QSearchExperience extends InternalQBaseExperience<
    QSearchContentOptions,
    InternalQSearchExperience,
    IQSearchExperience,
    TransformedQSearchContentOptions,
    QSearchExperienceFrame
> {
    protected experience: IQSearchExperience;
    protected internalExperience: InternalQSearchExperience;
    protected experienceFrame: QSearchExperienceFrame;
    protected experienceId: string;
    protected frameStyles?: FrameStyles;

    constructor(
        frameOptions: FrameOptions,
        contentOptions: QSearchContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        super(frameOptions, contentOptions, controlOptions, experienceIdentifiers);

        this.experience = this.extractExperienceFromUrl(frameOptions.url);

        const {experienceIdentifier, internalExperience} = this.getInternalExperienceInfo<
            InternalQSearchExperience,
            IQSearchExperience
        >(this.experience);

        this.internalExperience = internalExperience;
        this.experienceId = experienceIdentifier;

        this.experienceFrame = new QSearchExperienceFrame(
            frameOptions,
            controlOptions,
            contentOptions,
            this.transformQSearchContentOptions(contentOptions),
            internalExperience,
            experienceIdentifier,
            this.interceptMessage
        );
    }

    protected extractExperienceFromUrl = (url: string): IQSearchExperience => {
        const matches: Array<string> = /^https:\/\/[^/]+\/embedding\/[^/]+\/q\/search(\/|\?|$)/i.exec(url) || [];

        if (matches.length < 2) {
            this.frameOptions.onChange?.(
                new ChangeEvent(
                    ChangeEventName.INVALID_URL,
                    ChangeEventLevel.ERROR,
                    'Invalid q-search experience URL',
                    {url}
                ),
                {frame: this.experienceFrame.iframe}
            );

            throw new Error('Invalid q-search experience URL');
        }

        return {
            experienceType: ExperienceType.QSEARCH,
        };
    };

    private interceptMessage = (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
        switch (messageEvent.eventName) {
            case MessageEventName.Q_SEARCH_OPENED:
            case MessageEventName.Q_SEARCH_CLOSED: {
                if (typeof messageEvent.message === 'object') {
                    metadata?.frame?.style.setProperty('height', `${messageEvent?.message?.height}px`);
                }
                break;
            }
            case MessageEventName.CONTENT_LOADED: {
                this.trackOutsideClicks();
                break;
            }
            case MessageEventName.Q_SEARCH_ENTERED_FULLSCREEN: {
                this.enterFullScreen(metadata);
                break;
            }
            case MessageEventName.Q_SEARCH_EXITED_FULLSCREEN: {
                this.exitFullScreen(metadata);
                break;
            }
        }
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    private transformQSearchContentOptions = (contentOptions: QSearchContentOptions) => {
        const {
            hideIcon,
            hideTopicName,
            theme,
            allowTopicSelection,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const transformedContentOptions = this.transformContentOptions<TransformedQSearchContentOptions>(
            {
                allowTopicSelection,
            },
            unrecognizedContentOptions
        );

        if (hideIcon !== undefined) {
            transformedContentOptions.qBarIconDisabled = hideIcon;
        }

        if (hideTopicName !== undefined) {
            transformedContentOptions.qBarTopicNameDisabled = hideTopicName;
        }

        if (theme !== undefined) {
            transformedContentOptions.themeId = theme;
        }

        return transformedContentOptions;
    };
}
