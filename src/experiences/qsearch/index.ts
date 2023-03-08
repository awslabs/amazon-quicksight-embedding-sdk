// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {InternalExperience, InternalQSearchExperience, QSearchExperience} from '../../types';
import {ExperienceType} from '../../enums';
import createQSearchFrame from './createQSearchFrame';

const isQSearchExperience = (experience: InternalExperience): experience is InternalQSearchExperience => {
    return !!experience && experience.experienceType === ExperienceType.QSEARCH;
};

const extractQSearchExperienceFromUrl = (url: string): QSearchExperience => {
    const matches: Array<string> = /^https:\/\/[^/]+\/embedding\/[^/]+\/q\/search(\/|\?|$)/i.exec(url) || [];
    if (matches.length < 2) {
        return;
    }
    return {
        experienceType: ExperienceType.QSEARCH,
    };
};

const getQSearchExperienceIdentifier = (experience: InternalExperience): string => {
    if (!isQSearchExperience(experience)) {
        return;
    }
    const {contextId, experienceType, discriminator} = experience;
    return [contextId, experienceType, discriminator].filter(Boolean).join('-');
};

export {createQSearchFrame, extractQSearchExperienceFromUrl, getQSearchExperienceIdentifier, isQSearchExperience};
