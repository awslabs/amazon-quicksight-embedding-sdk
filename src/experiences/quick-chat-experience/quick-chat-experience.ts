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
import {ChangeEvent, EmbeddingMessageEvent, ResponseMessage} from '@common/events/events';
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
        frameOpts: FrameOptions,
        contentOptions: QuickChatContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        const frameOptions = {
            // Clipboard permissions default to true for Quick Chat Experience
            framePermissions: {clipboardRead: true, clipboardWrite: true, ...frameOpts.framePermissions},
            ...frameOpts,
        } satisfies FrameOptions;

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
            experienceIdentifier,
            this.interceptMessage
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private interceptMessage = (messageEvent: EmbeddingEvents, _metadata?: ExperienceFrameMetadata) => {
        if (messageEvent.eventName === MessageEventName.EXPERIENCE_INITIALIZED) {
            if (this.contentOptions.promptOptions?.initialPrompt) {
                this.sendPrompt(this.contentOptions.promptOptions.initialPrompt);
            }
        }
    };

    public sendPrompt = (prompt: string): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.SEND_PROMPT, {prompt}));
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    private transformQuickChatContentOptions = (contentOptions: QuickChatContentOptions) => {
        const unrecognizedOptions: string[] = [];

        const markUnrecognized = (properties: object, prefix = '') => {
            Object.keys(properties).forEach(key => {
                unrecognizedOptions.push(prefix + key);
            });
        };

        const {
            fixedAgentArn,
            agentOptions = {},
            promptOptions = {},
            footerOptions = {},
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage, // excluded from unrecognized
            ...unrecognizedContentOptions
        } = contentOptions;

        markUnrecognized(unrecognizedContentOptions);

        const {fixedAgentId, ...unrecognizedAgentOptions} = agentOptions;

        markUnrecognized(unrecognizedAgentOptions, 'agentOptions.');

        const {
            allowFileAttachments,
            showAgentKnowledgeBoundary,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            initialPrompt, // excluded from unrecognized
            showWebSearch,
            ...unrecognizedPromptOptions
        } = promptOptions;

        markUnrecognized(unrecognizedPromptOptions, 'promptOptions.');

        const {showBrandAttribution, showUsagePolicy, ...unrecognizedFooterOptions} = footerOptions;

        markUnrecognized(unrecognizedFooterOptions, 'footerOptions.');

        this.warnUnrecognizedContentOptions(unrecognizedOptions);

        const validatedFixedAgentId = this.validateFixedAgentId(fixedAgentArn, fixedAgentId);

        const transformedContentOptions: TransformedQuickChatContentOptions = {
            allowFileAttachments,
            showAgentKnowledgeBoundary,
            showBrandAttribution,
            showUsagePolicy,
            showWebSearch,
            fixedAgentId: validatedFixedAgentId,
        };

        return transformedContentOptions;
    };

    private validateFixedAgentId = (fixedAgentArn?: string, fixedAgentId?: string) => {
        if (fixedAgentArn && fixedAgentId) {
            throw new Error(
                'Both fixedAgentArn and agentOptions.fixedAgentId cannot be specified. Use agentOptions.fixedAgentId.'
            );
        }

        if (fixedAgentId) {
            return fixedAgentId;
        }

        if (fixedAgentArn) {
            this.logger?.warn('The fixedAgentArn option is deprecated. Use agentOptions.fixedAgentId instead.');
            const parsedFixedAgentId = fixedAgentArn.split('/')[1];
            if (!parsedFixedAgentId) {
                throw new Error('Invalid fixedAgentArn.');
            }
            return parsedFixedAgentId;
        }

        return undefined;
    };
}
