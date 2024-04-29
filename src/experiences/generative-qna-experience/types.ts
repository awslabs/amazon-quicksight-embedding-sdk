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
    allowTopicSelection?: boolean;
    allowFullscreen?: boolean;
    searchPlaceholderText?: string;
    panelOptions?: GenerativeQnAPanelOptions;
    themeOptions?: QThemeOptions;
}

export interface TransformedGenerativeQnAContentOptions extends BaseContentOptions {
    qShowTopicName?: boolean;
    qShowPinboard?: boolean;
    qAllowTopicSelection?: boolean;
    qAllowFullscreen?: boolean;
    qSearchPlaceholderText?: string;
    qPanelType?: string;
    qPanelTitle?: string;
    qShowPanelIcon?: boolean;
    qPanelFocusedHeight?: string;
    qPanelExpandedHeight?: string;
    themeArn?: string;
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
