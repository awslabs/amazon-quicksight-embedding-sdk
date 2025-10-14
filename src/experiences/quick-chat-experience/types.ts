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
    fixedAgentArn?: string;
    initialPrompt?: string;
}

export interface TransformedQuickChatContentOptions extends BaseContentOptions {
    fixedAgentArn?: string;
}
