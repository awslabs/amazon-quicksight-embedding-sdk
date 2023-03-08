// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Experience, InternalControlExperience, InternalExperience, UrlInfo} from '../../types';
import {ExperienceType} from '../../enums';
import createControlFrame from './createControlFrame';

const isControlExperience = (experience: InternalExperience): experience is InternalControlExperience => {
    return !!experience && experience.experienceType === ExperienceType.CONTROL;
};

const getControlExperienceBaseUrl = (_experience: Experience, urlInfo: UrlInfo): URL => {
    const {host, guid} = urlInfo;
    const urlString = `${host}/embed/${guid}/embedControl`;
    return new URL(urlString);
};

const getControlExperienceIdentifier = (experience: InternalExperience): string => {
    if (!isControlExperience(experience)) {
        return;
    }
    const {contextId, experienceType, discriminator} = experience;
    return [contextId, experienceType, discriminator].filter(Boolean).join('-');
};

export {createControlFrame, getControlExperienceBaseUrl, getControlExperienceIdentifier, isControlExperience};
