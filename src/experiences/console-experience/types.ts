// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';

export interface IConsoleExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.CONSOLE;
}

export interface InternalConsoleExperience extends IConsoleExperience {
    contextId: string;
}

export interface ConsoleContentOptions extends BaseContentOptions {
    locale?: string;
}

export type TransformedConsoleContentOptions = ConsoleContentOptions;
