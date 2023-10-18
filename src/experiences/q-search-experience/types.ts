// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';

export interface IQSearchExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.QSEARCH;
}

export interface InternalQSearchExperience extends IQSearchExperience {
    contextId: string;
}

export interface QSearchContentOptions extends BaseContentOptions {
    hideIcon?: boolean;
    hideTopicName?: boolean;
    theme?: string;
    allowTopicSelection?: boolean;
}

export interface TransformedQSearchContentOptions extends BaseContentOptions {
    qBarIconDisabled?: boolean;
    qBarTopicNameDisabled?: boolean;
    themeId?: string;
    allowTopicSelection?: boolean;
}

export type FrameStyles = {
    position: string;
    top: string;
    left: string;
    zIndex: string;
    width: string;
    height: string;
};
