// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ExperienceType, FrameOptions} from '../base-experience';
import {
    FrameStyles,
    InternalQSearchExperience,
    IQSearchExperience,
    QSearchContentOptions,
    TransformedQSearchContentOptions,
} from './types';
import {QSearchExperienceFrame} from './frame/q-search-experience-frame';
import {ControlOptions} from '../control-experience';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {ChangeEvent, EmbeddingMessageEvent, ResponseMessage} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import {ExperienceFrameMetadata} from '@common/embedding-context/types';

export class QSearchExperience extends BaseExperience<
    QSearchContentOptions,
    InternalQSearchExperience,
    IQSearchExperience,
    TransformedQSearchContentOptions,
    QSearchExperienceFrame
> {
    static readonly MAX_Z_INDEX = '2147483647';
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

    close = (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.CLOSE_Q_SEARCH));
    };

    setQuestion = async (question: string): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_Q_SEARCH_QUESTION, {
                question,
            })
        );
    };

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
                const clickHandler = (event: MouseEvent) => {
                    !this.experienceFrame.iframe?.contains(event.target as Node) && this.close();
                };

                window.addEventListener('click', clickHandler);
                this.controlOptions.eventManager.addEventListenerForCleanup(this.experienceId, () =>
                    window.removeEventListener('click', clickHandler)
                );
                break;
            }
            case MessageEventName.Q_SEARCH_ENTERED_FULLSCREEN: {
                if (!this.frameStyles && metadata?.frame) {
                    this.frameStyles = {
                        position: metadata.frame?.style.position,
                        top: metadata.frame?.style.top,
                        left: metadata.frame.style.left,
                        zIndex: metadata.frame.style.zIndex,
                        width: metadata.frame.style.width,
                        height: metadata.frame.style.height,
                    };

                    metadata.frame.style.position = 'fixed';
                    metadata.frame.style.top = '0px';
                    metadata.frame.style.left = '0px';
                    metadata.frame.style.zIndex = QSearchExperience.MAX_Z_INDEX;
                    metadata.frame.style.width = '100vw';
                    metadata.frame.style.height = '100vh';
                }

                break;
            }
            case MessageEventName.Q_SEARCH_EXITED_FULLSCREEN: {
                if (this.frameStyles && metadata?.frame) {
                    metadata.frame.style.position = this.frameStyles.position;
                    metadata.frame.style.top = this.frameStyles.top;
                    metadata.frame.style.left = this.frameStyles.left;
                    metadata.frame.style.zIndex = this.frameStyles.zIndex;
                    metadata.frame.style.width = this.frameStyles.width;
                    metadata.frame.style.height = this.frameStyles.height;
                }

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
