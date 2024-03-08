// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';
import {EventManager} from '@common/event-manager/event-manager';
import {DataResponse, ErrorResponse, SuccessResponse, TargetedMessageEvent} from '@common/events/events';

export interface IControlExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.CONTROL;
}

export interface InternalControlExperience extends IControlExperience {
    contextId: string;
}

export type ControlContentOptions = BaseContentOptions;

export type ControlOptions = {
    eventManager: EventManager;
    contextId: string;
    areCookiesDisabled?: boolean;
    urlInfo: UrlInfo;
    timeout?: number;
    sendToControlFrame?: (
        messageEvent: TargetedMessageEvent
    ) => Promise<SuccessResponse | ErrorResponse | DataResponse>;
    onChange?: EventListener;
};

export type UrlInfo = {
    sessionId: string;
    host: string;
    urlSearchParams?: URLSearchParams;
};
