// Copyright 2025 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';

export interface IQuickChatExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.QUICKCHAT;
}

export interface InternalQuickChatExperience extends IQuickChatExperience {
    contextId: string;
}

export interface QuickChatContentOptions extends BaseContentOptions {
    /**
     * @deprecated use {@link AgentOptions.fixedAgentId} instead
     **/
    fixedAgentArn?: string;
    agentOptions?: AgentOptions;
    promptOptions?: PromptOptions;
    footerOptions?: FooterOptions;
}

export interface AgentOptions {
    /**
     * The chat will be locked to use the specified chat agent.
     */
    fixedAgentId?: string;
}

export interface PromptOptions {
    /**
     * Whether the attach files button will be shown and files can be uploaded
     * via drag and drop onto the prompt.
     */
    allowFileAttachments?: boolean;
    /**
     * A prompt that will be sent once on initial chat panel load.
     */
    initialPrompt?: string;
    /**
     * Whether the agent knowledge boundary menu will be shown.
     */
    showAgentKnowledgeBoundary?: boolean;
    /**
     * Whether the web search button will be shown.
     */
    showWebSearch?: boolean;
}

export interface FooterOptions {
    /**
     * Whether the brand attribution statement will be shown.
     */
    showBrandAttribution?: boolean;
    /**
     * Whether the usage policy link will be shown.
     */
    showUsagePolicy?: boolean;
}

export interface TransformedQuickChatContentOptions extends BaseContentOptions {
    allowFileAttachments?: boolean;
    fixedAgentId?: string;
    showAgentKnowledgeBoundary?: boolean;
    showBrandAttribution?: boolean;
    showUsagePolicy?: boolean;
    showWebSearch?: boolean;
}
