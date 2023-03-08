// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {InternalContextExperience, InternalExperience} from '../../types';
import {ExperienceType} from '../../enums';

const isContextExperience = (experience: InternalExperience): experience is InternalContextExperience => {
    return !!experience && experience.experienceType === ExperienceType.CONTEXT;
};

const getContextExperienceIdentifier = (experience: InternalExperience): string => {
    if (!isContextExperience(experience)) {
        return;
    }
    const {contextId, experienceType, discriminator} = experience;
    return [contextId, experienceType, discriminator].filter(Boolean).join('-');
};

export {getContextExperienceIdentifier, isContextExperience};
