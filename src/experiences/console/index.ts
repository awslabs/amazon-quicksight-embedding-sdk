// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {InternalExperience, ConsoleExperience, InternalConsoleExperience} from '../../types';
import {ExperienceType} from '../../enums';
import createConsoleFrame from './createConsoleFrame';

const isConsoleExperience = (experience: InternalExperience): experience is InternalConsoleExperience => {
    return !!experience && experience.experienceType === ExperienceType.CONSOLE;
};

const extractConsoleExperienceFromUrl = (url: string): ConsoleExperience => {
    const matches: Array<string> =
        /^https:\/\/[^/]+\/embedding\/[^/]+\/(start(\/(favorites|dashboards|analyses))?|dashboards\/[\w-]+|analyses\/[\w-]+)(\?|$)/i.exec(url) || [];
    if (matches.length < 5) {
        return;
    }
    return {
        experienceType: ExperienceType.CONSOLE,
    };
};

const getConsoleExperienceIdentifier = (experience: InternalExperience): string => {
    if (!isConsoleExperience(experience)) {
        return;
    }
    const {contextId, experienceType, discriminator} = experience;
    return [contextId, experienceType, discriminator].filter(Boolean).join('-');
};

export {createConsoleFrame, extractConsoleExperienceFromUrl, getConsoleExperienceIdentifier, isConsoleExperience};
