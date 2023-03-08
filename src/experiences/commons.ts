// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {getVisualExperienceIdentifier, isVisualExperience} from './visual';
import {getConsoleExperienceIdentifier, isConsoleExperience} from './console';
import {getContextExperienceIdentifier, isContextExperience} from './context';
import {getControlExperienceIdentifier, isControlExperience} from './control';
import {getDashboardExperienceIdentifier, isDashboardExperience} from './dashboard';
import {getQSearchExperienceIdentifier, isQSearchExperience} from './qsearch';
import {Experience, InternalExperience} from '../types';

const getExperienceIdentifier = (experience: InternalExperience): string => {
    if (!experience) {
        throw new Error('No experience provided');
    }
    if (isVisualExperience(experience)) {
        return getVisualExperienceIdentifier(experience);
    } else if (isDashboardExperience(experience)) {
        return getDashboardExperienceIdentifier(experience);
    } else if (isConsoleExperience(experience)) {
        return getConsoleExperienceIdentifier(experience);
    } else if (isContextExperience(experience)) {
        return getContextExperienceIdentifier(experience);
    } else if (isQSearchExperience(experience)) {
        return getQSearchExperienceIdentifier(experience);
    } else if (isControlExperience(experience)) {
        return getControlExperienceIdentifier(experience);
    }
    throw new Error('Cannot create experience identifier for the experience');
};

const buildInternalExperienceInfo = (
    experience: Experience,
    allExperienceIdentifiers: Set<string>,
    contextId: string,
    getExperienceIdentifier: (internalExperience: InternalExperience) => string
) => {
    let discriminator = -1;
    let internalExperience: InternalExperience;
    let experienceIdentifier: string;
    do {
        discriminator++;
        internalExperience = {
            ...experience,
            contextId,
            discriminator,
        };
        experienceIdentifier = getExperienceIdentifier(internalExperience);
    } while (allExperienceIdentifiers.has(experienceIdentifier));
    if (!experienceIdentifier) {
        return;
    }
    allExperienceIdentifiers.add(experienceIdentifier);
    return {
        experienceIdentifier,
        internalExperience,
    };
};

export {buildInternalExperienceInfo, getExperienceIdentifier};
