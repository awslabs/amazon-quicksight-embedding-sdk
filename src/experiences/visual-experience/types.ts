// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {ThemeConfiguration} from '@aws-sdk/client-quicksight';
import {Parameter, ParametersAsObject, ThemeOptions} from '../../common/types';
import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';

export interface IVisualExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.VISUAL;
    dashboardId: string;
    sheetId: string;
    visualId: string;
}

export interface InternalVisualExperience extends IVisualExperience {
    contextId: string;
}

export interface VisualContentOptions extends BaseContentOptions {
    locale?: string;
    parameters?: Parameter[];
    fitToIframeWidth?: boolean;
    themeOptions?: ThemeOptions;
}

export interface TransformedVisualContentOptions extends BaseContentOptions {
    locale?: string;
    fitToIframeWidth?: boolean;
    parameters?: ParametersAsObject;
    themeArn?: string;
    themeOverride?: ThemeConfiguration;
}
