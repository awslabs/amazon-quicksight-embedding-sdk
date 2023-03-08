// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {DashboardExperience, InternalDashboardExperience, InternalExperience} from '../../types';
import {ExperienceType} from '../../enums';
import createDashboardFrame from './createDashboardFrame';

const isDashboardExperience = (experience: InternalExperience): experience is InternalDashboardExperience => {
    return !!experience && experience.experienceType === ExperienceType.DASHBOARD;
};

const extractDashboardExperienceFromUrl = (url: string): DashboardExperience => {
    const matches: Array<string> = /^https:\/\/[^/]+\/embed\/[^/]+\/dashboards\/([\w-]+)(\?|$)/i.exec(url) || [];
    if (matches.length < 3) {
        return;
    }
    return {
        experienceType: ExperienceType.DASHBOARD,
        dashboardId: matches[1],
    };
};

const getDashboardExperienceIdentifier = (experience: InternalExperience): string => {
    if (!isDashboardExperience(experience)) {
        return;
    }
    const {contextId, experienceType, dashboardId, discriminator} = experience;
    return [contextId, experienceType, dashboardId, discriminator].filter(Boolean).join('-');
};

export {createDashboardFrame, extractDashboardExperienceFromUrl, getDashboardExperienceIdentifier, isDashboardExperience};
