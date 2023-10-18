// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Parameter, ParametersAsObject} from '../../common/types';
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
}

export interface TransformedVisualContentOptions extends BaseContentOptions {
    locale?: string;
    fitToIframeWidth?: boolean;
    parameters?: ParametersAsObject;
}
