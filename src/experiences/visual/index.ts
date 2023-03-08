// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {InternalExperience, InternalVisualExperience, VisualExperience} from '../../types';
import {ExperienceType} from '../../enums';
import createVisualFrame from './createVisualFrame';

const isVisualExperience = (experience: InternalExperience): experience is InternalVisualExperience => {
    return !!experience && experience.experienceType === ExperienceType.VISUAL;
};

const extractVisualExperienceFromUrl = (url: string): VisualExperience => {
    const matches: Array<string> = /^https:\/\/[^/]+\/embed\/[^/]+\/dashboards\/([\w-]+)\/sheets\/([\w-]+)\/visuals\/([\w-]+)(\?|$)/i.exec(url) || [];
    if (matches.length < 5) {
        return;
    }
    return {
        experienceType: ExperienceType.VISUAL,
        dashboardId: matches[1],
        sheetId: matches[2],
        visualId: matches[3],
    };
};

const getVisualExperienceIdentifier = (experience: InternalExperience): string => {
    if (!isVisualExperience(experience)) {
        return;
    }
    const {contextId, experienceType, dashboardId, sheetId, visualId, discriminator} = experience;
    return [contextId, experienceType, dashboardId, sheetId, visualId, discriminator].filter(Boolean).join('-');
};

export {createVisualFrame, extractVisualExperienceFromUrl, getVisualExperienceIdentifier, isVisualExperience};
