// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';

export interface IGenerativeQnAExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.GENERATIVEQNA;
}

export interface InternalGenerativeQnAExperience extends IGenerativeQnAExperience {
    contextId: string;
}

export interface GenerativeQnAContentOptions extends BaseContentOptions {
    showTopicName?: boolean;
    showPinboard?: boolean;
    showSearchBar?: boolean;
    showInterpretedAs?: boolean;
    showFeedback?: boolean;
    showGeneratedNarrative?: boolean;
    showDidYouMean?: boolean;
    showComplementaryVisuals?: boolean;
    showQBusinessInsights?: boolean;
    showSeeWhy?: boolean;
    allowTopicSelection?: boolean;
    allowFullscreen?: boolean;
    allowReturn?: boolean;
    searchPlaceholderText?: string;
    panelOptions?: GenerativeQnAPanelOptions;
    themeOptions?: QThemeOptions;
    initialQuestionId?: string;
    initialAnswerId?: string;
}

export interface TransformedGenerativeQnAContentOptions extends BaseContentOptions {
    qShowTopicName?: boolean;
    qShowPinboard?: boolean;
    qShowSearchBar?: boolean;
    qShowInterpretedAs?: boolean;
    qShowFeedback?: boolean;
    qShowGeneratedNarrative?: boolean;
    qShowDidYouMean?: boolean;
    qShowComplementaryVisuals?: boolean;
    qShowQBusinessInsights?: boolean;
    qShowSeeWhy?: boolean;
    qAllowTopicSelection?: boolean;
    qAllowFullscreen?: boolean;
    qAllowReturn?: boolean;
    qSearchPlaceholderText?: string;
    qPanelType?: string;
    qPanelTitle?: string;
    qShowPanelIcon?: boolean;
    qPanelFocusedHeight?: string;
    qPanelExpandedHeight?: string;
    themeArn?: string;
    questionId?: string;
    answerId?: string;
}

export type GenerativeQnAPanelOptions = GenerativeQnAFullPanelOptions | GenerativeQnASearchBarOptions;

export const GenerativeQnAPanelType = {
    FULL: 'FULL',
    SEARCH_BAR: 'SEARCH_BAR',
} as const;

export type GenerativeQnAFullPanelOptions = {
    panelType: typeof GenerativeQnAPanelType.FULL;
    title?: string;
    showQIcon?: boolean;
};

export type GenerativeQnASearchBarOptions = {
    panelType: typeof GenerativeQnAPanelType.SEARCH_BAR;
    focusedHeight?: string;
    expandedHeight?: string;
};

export type QThemeOptions = {
    themeArn?: string;
};
