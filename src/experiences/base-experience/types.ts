// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    InternalVisualExperience,
    IVisualExperience,
    TransformedVisualContentOptions,
    VisualContentOptions,
} from '../visual-experience';
import {
    DashboardContentOptions,
    IDashboardExperience,
    InternalDashboardExperience,
    TransformedDashboardContentOptions,
} from '../dashboard-experience';
import {
    InternalQSearchExperience,
    IQSearchExperience,
    QSearchContentOptions,
    TransformedQSearchContentOptions,
} from '../q-search-experience';
import {
    ConsoleContentOptions,
    IConsoleExperience,
    InternalConsoleExperience,
    TransformedConsoleContentOptions,
} from '../console-experience';
import {
    GenerativeQnAContentOptions,
    IGenerativeQnAExperience,
    InternalGenerativeQnAExperience,
    TransformedGenerativeQnAContentOptions,
} from '../generative-qna-experience';
import {ControlContentOptions, IControlExperience, InternalControlExperience} from '../control-experience';
import {IContextExperience, InternalContextExperience} from '../../common/embedding-context';
import {EventListener} from '../../common/event-manager';

export type ContentOptions =
    | VisualContentOptions
    | DashboardContentOptions
    | QSearchContentOptions
    | ConsoleContentOptions
    | ControlContentOptions
    | GenerativeQnAContentOptions;

export type FrameOptions = {
    url: string;
    container: string | HTMLElement;
    width?: string;
    height?: string;
    resizeHeightOnSizeChangedEvent?: boolean;
    withIframePlaceholder?: boolean | HTMLElement;
    className?: string;
    onChange?: EventListener;
};

export type TransformedContentOptions =
    | TransformedConsoleContentOptions
    | TransformedDashboardContentOptions
    | TransformedQSearchContentOptions
    | TransformedVisualContentOptions
    | TransformedGenerativeQnAContentOptions
    | object;

export type Experiences =
    | IConsoleExperience
    | IContextExperience
    | IControlExperience
    | IVisualExperience
    | IDashboardExperience
    | IQSearchExperience
    | IGenerativeQnAExperience;

export type InternalExperiences =
    | InternalConsoleExperience
    | InternalContextExperience
    | InternalControlExperience
    | InternalVisualExperience
    | InternalDashboardExperience
    | InternalQSearchExperience
    | InternalGenerativeQnAExperience;

export interface InternalExperienceInfo<InternalExperience extends InternalExperiences> {
    experienceIdentifier: string;
    internalExperience: InternalExperience;
}

export const ExperienceType = {
    CONSOLE: 'CONSOLE',
    CONTEXT: 'CONTEXT',
    CONTROL: 'CONTROL',
    VISUAL: 'VISUAL',
    DASHBOARD: 'DASHBOARD',
    QSEARCH: 'QSEARCH',
    GENERATIVEQNA: 'QSEARCH', // Internal experience type unchanged from QSEARCH
} as const;

export type ExperienceType = (typeof ExperienceType)[keyof typeof ExperienceType];

export interface IBaseExperience {
    experienceType: ExperienceType;
    discriminator?: number;
}

export interface BaseContentOptions {
    onMessage?: EventListener;
}
