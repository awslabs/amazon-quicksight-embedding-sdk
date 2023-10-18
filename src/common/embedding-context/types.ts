// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ExperienceType, FrameOptions, IBaseExperience} from '../../experiences/base-experience';
import {DashboardContentOptions} from '../../experiences/dashboard-experience';
import {VisualContentOptions} from '../../experiences/visual-experience';
import {QSearchContentOptions} from '../../experiences/q-search-experience';
import {ConsoleContentOptions} from '../../experiences/console-experience';
import {EmbeddingIFrameElement} from '../iframe';
import {EventListener} from '../event-manager';
import {DashboardExperience} from '@experience/dashboard-experience/dashboard-experience';
import {VisualExperience} from '@experience/visual-experience/visual-experience';
import {ConsoleExperience} from '@experience/console-experience/console-experience';
import {QSearchExperience} from '@experience/q-search-experience/q-search-experience';

export type ExperienceFrameMetadata = {
    frame: EmbeddingIFrameElement | null;
};

export type EmbeddingContextFrameOptions = {
    onChange?: EventListener;
};

export interface IContextExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.CONTEXT;
}

export interface InternalContextExperience extends IContextExperience {
    contextId: string;
}

export type IEmbeddingContext = {
    embedDashboard: (
        frameOptions: FrameOptions,
        contentOptions?: DashboardContentOptions
    ) => Promise<DashboardExperience>;
    embedVisual: (frameOptions: FrameOptions, contentOptions?: VisualContentOptions) => Promise<VisualExperience>;
    embedQSearchBar: (frameOptions: FrameOptions, contentOptions?: QSearchContentOptions) => Promise<QSearchExperience>;
    embedConsole: (frameOptions: FrameOptions, contentOptions?: ConsoleContentOptions) => Promise<ConsoleExperience>;
};
