// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ExperienceType, FrameOptions} from '../base-experience';
import {
    InternalGenerativeQnAExperience,
    IGenerativeQnAExperience,
    GenerativeQnAContentOptions,
    TransformedGenerativeQnAContentOptions,
    GenerativeQnAPanelType,
} from './types';
import {FrameStyles} from '@experience/internal-q-base-experience/types';
import {GenerativeQnAExperienceFrame} from './frame/generative-qna-experience-frame';
import {ControlOptions} from '../control-experience';
import {InternalQBaseExperience} from '@experience/internal-q-base-experience/internal-q-base-experience';
import {ChangeEvent} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import {ExperienceFrameMetadata} from '@common/embedding-context/types';

export class GenerativeQnAExperience extends InternalQBaseExperience<
    GenerativeQnAContentOptions,
    InternalGenerativeQnAExperience,
    IGenerativeQnAExperience,
    TransformedGenerativeQnAContentOptions,
    GenerativeQnAExperienceFrame
> {
    protected experience: IGenerativeQnAExperience;
    protected internalExperience: InternalGenerativeQnAExperience;
    protected experienceFrame: GenerativeQnAExperienceFrame;
    protected experienceId: string;
    protected frameStyles?: FrameStyles;
    static readonly TEXT_PROPERTY_MAX_LENGTH = 200;

    constructor(
        frameOptions: FrameOptions,
        contentOptions: GenerativeQnAContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        super(frameOptions, contentOptions, controlOptions, experienceIdentifiers);

        this.experience = this.extractExperienceFromUrl(frameOptions.url);

        const {experienceIdentifier, internalExperience} = this.getInternalExperienceInfo<
            InternalGenerativeQnAExperience,
            IGenerativeQnAExperience
        >(this.experience);

        this.internalExperience = internalExperience;
        this.experienceId = experienceIdentifier;

        this.experienceFrame = new GenerativeQnAExperienceFrame(
            frameOptions,
            controlOptions,
            contentOptions,
            this.transformGenerativeQnAContentOptions(contentOptions),
            internalExperience,
            experienceIdentifier,
            this.interceptMessage
        );
    }

    protected extractExperienceFromUrl = (url: string): IGenerativeQnAExperience => {
        const matches: Array<string> = /^https:\/\/[^/]+\/embedding\/[^/]+\/q\/search(\/|\?|$)/i.exec(url) || [];

        if (matches.length < 2) {
            this.frameOptions.onChange?.(
                new ChangeEvent(
                    ChangeEventName.INVALID_URL,
                    ChangeEventLevel.ERROR,
                    'Invalid generative-qna experience URL',
                    {url}
                ),
                {frame: this.experienceFrame.iframe}
            );

            throw new Error('Invalid generative-qna experience URL');
        }

        return {
            experienceType: ExperienceType.GENERATIVEQNA,
        };
    };

    private interceptMessage = (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
        switch (messageEvent.eventName) {
            case MessageEventName.Q_SEARCH_OPENED:
            case MessageEventName.Q_SEARCH_CLOSED:
            case MessageEventName.Q_SEARCH_FOCUSED: {
                if (typeof messageEvent.message === 'object') {
                    metadata?.frame?.style.setProperty('height', `${messageEvent?.message?.height}`);
                }
                break;
            }
            case MessageEventName.CONTENT_LOADED: {
                if (this.contentOptions?.panelOptions?.panelType === GenerativeQnAPanelType.SEARCH_BAR) {
                    this.trackOutsideClicks();
                }
                break;
            }
            case MessageEventName.Q_PANEL_ENTERED_FULLSCREEN: {
                this.enterFullScreen(metadata);
                break;
            }
            case MessageEventName.Q_PANEL_EXITED_FULLSCREEN: {
                this.exitFullScreen(metadata);
                break;
            }
        }
    };

    private transformGenerativeQnAContentOptions = (contentOptions: GenerativeQnAContentOptions) => {
        const unrecognizedProperties: string[] = [];

        const markUnrecognized = (properties: object, prefix = '') => {
            Object.keys(properties).forEach(key => {
                unrecognizedProperties.push(prefix + key);
            });
        };

        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage, // excluded from unrecognized
            showTopicName,
            showPinboard,
            allowTopicSelection,
            allowFullscreen,
            searchPlaceholderText,
            panelOptions,
            themeOptions,
            ...unrecognizedContentOptions
        } = contentOptions;

        markUnrecognized(unrecognizedContentOptions);

        const transformedContentOptions: TransformedGenerativeQnAContentOptions = {
            qShowTopicName: showTopicName,
            qShowPinboard: showPinboard,
            qAllowTopicSelection: allowTopicSelection,
            qAllowFullscreen: allowFullscreen,
        };

        if (typeof searchPlaceholderText === 'string') {
            this.checkMaxLength(searchPlaceholderText, 'searchPlaceholderText');
            transformedContentOptions.qSearchPlaceholderText = encodeURIComponent(searchPlaceholderText);
        }

        if (panelOptions) {
            const {panelType} = panelOptions;
            transformedContentOptions.qPanelType = panelType;

            if (panelType === GenerativeQnAPanelType.FULL) {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    panelType: unusedPanelType, // excluded from unrecognized
                    title,
                    showQIcon,
                    ...unrecognizedPanelOptions
                } = panelOptions;

                if (typeof title === 'string') {
                    this.checkMaxLength(title, 'panelOptions.title');
                    transformedContentOptions.qPanelTitle = encodeURIComponent(title);
                }
                transformedContentOptions.qShowPanelIcon = showQIcon;

                markUnrecognized(unrecognizedPanelOptions, 'panelOptions.');
            } else if (panelType === GenerativeQnAPanelType.SEARCH_BAR) {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    panelType: unusedPanelType, // excluded from unrecognized
                    focusedHeight,
                    expandedHeight,
                    ...unrecognizedPanelOptions
                } = panelOptions;

                transformedContentOptions.qPanelFocusedHeight = focusedHeight;
                transformedContentOptions.qPanelExpandedHeight = expandedHeight;

                markUnrecognized(unrecognizedPanelOptions, 'panelOptions.');
            } else {
                throw new Error('panelOptions.panelType should be one of following: [FULL, SEARCH_BAR]');
            }
        }

        if (themeOptions?.themeArn) {
            transformedContentOptions.themeArn = themeOptions.themeArn;
        }

        this.warnUnrecognizedContentOptions(unrecognizedProperties);

        return transformedContentOptions;
    };

    private checkMaxLength = (value: string, propertyName: string) => {
        const maxLength = GenerativeQnAExperience.TEXT_PROPERTY_MAX_LENGTH;
        if (value.length > maxLength) {
            throw new Error(`${propertyName} should be less than ${maxLength} characters`);
        }
    };
}
