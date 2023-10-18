// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {InternalVisualExperience, TransformedVisualContentOptions, VisualContentOptions} from '../types';
import {BaseExperienceFrame} from '@experience/base-experience/frame/experience-frame';
import {FrameOptions} from '@experience/base-experience/types';
import {ControlOptions} from '@experience/control-experience/types';
import {EventListener} from '@common/event-manager/types';

export class VisualExperienceFrame extends BaseExperienceFrame<
    VisualContentOptions,
    TransformedVisualContentOptions,
    InternalVisualExperience
> {
    constructor(
        frameOptions: FrameOptions,
        controlOptions: ControlOptions,
        contentOptions: VisualContentOptions,
        transformedContentOptions: TransformedVisualContentOptions,
        internalExperience: InternalVisualExperience,
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
        const {parameters, ...otherOptions} = this.transformedContentOptions;
        const {contextId, discriminator} = this.internalExperience;

        const queryString = this.buildQueryString({
            ...otherOptions,
            contextId,
            discriminator,
        });

        const parameterString = this.buildParameterString(parameters);
        const fullQueryString = [queryString, parameterString].join('#');

        return [baseUrl, fullQueryString].join(baseUrl.includes('?') ? '&' : '?');
    };
}
