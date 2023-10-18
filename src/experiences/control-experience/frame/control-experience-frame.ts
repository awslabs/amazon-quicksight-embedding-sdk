// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ControlOptions, InternalControlExperience} from '../types';
import {EventListener} from '@common/event-manager/types';
import {BaseExperienceFrame} from '@experience/base-experience/frame/experience-frame';
import {BaseContentOptions, FrameOptions} from '@experience/base-experience/types';

export class ControlExperienceFrame extends BaseExperienceFrame<object, BaseContentOptions, InternalControlExperience> {
    constructor(
        frameOptions: FrameOptions,
        controlOptions: ControlOptions,
        contentOptions: BaseContentOptions,
        transformedContentOptions: object,
        internalExperience: InternalControlExperience,
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

        return [baseUrl, queryString].join('?');
    };
}
