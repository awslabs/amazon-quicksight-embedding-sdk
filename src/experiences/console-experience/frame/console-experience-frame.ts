// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ConsoleContentOptions, InternalConsoleExperience, TransformedConsoleContentOptions} from '../types';
import {BaseExperienceFrame} from '@experience/base-experience/frame/experience-frame';
import {FrameOptions} from '@experience/base-experience/types';
import {ControlOptions} from '@experience/control-experience/types';
import {EventListener} from '@common/event-manager/types';

export class ConsoleExperienceFrame extends BaseExperienceFrame<
    ConsoleContentOptions,
    TransformedConsoleContentOptions,
    InternalConsoleExperience
> {
    constructor(
        frameOptions: FrameOptions,
        controlOptions: ControlOptions,
        contentOptions: ConsoleContentOptions,
        transformedContentOptions: TransformedConsoleContentOptions,
        internalExperience: InternalConsoleExperience,
        experienceIdentifier: string,
        interceptMessage?: EventListener
    ) {
        super(
            frameOptions,
            controlOptions,
            contentOptions,
            transformedContentOptions,
            internalExperience,
            experienceIdentifier,
            interceptMessage
        );
        this.url = this.buildExperienceUrl(frameOptions.url);
        this.createExperienceIframe();
    }

    buildExperienceUrl = (baseUrl: string) => {
        const {contextId, discriminator} = this.internalExperience;

        const queryString = this.buildQueryString({
            ...this.transformedContentOptions,
            contextId,
            discriminator,
        });

        return [baseUrl, queryString].join(baseUrl.includes('?') ? '&' : '?');
    };
}
