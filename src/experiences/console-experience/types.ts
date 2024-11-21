// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';
import {ToolbarOption} from '../dashboard-experience';

export interface IConsoleExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.CONSOLE;
}

export interface InternalConsoleExperience extends IConsoleExperience {
    contextId: string;
}

export interface ConsoleToolbarOptions {
    executiveSummary?: boolean | ToolbarOption;
    dataQnA?: boolean | ToolbarOption;
}

export interface ConsoleContentOptions extends BaseContentOptions {
    locale?: string;
    toolbarOptions?: ConsoleToolbarOptions;
}

export interface TransformedConsoleContentOptions extends BaseContentOptions {
    locale?: string;
    showExecutiveSummaryIcon?: boolean;
    showDataQnAIcon?: boolean;
}
