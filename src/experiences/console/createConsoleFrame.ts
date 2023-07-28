// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    ControlOptions,
    TargetedMessageEvent,
    ConsoleContentOptions,
    ConsoleFrame,
    TransformedConsoleContentOptions,
    FrameOptions,
    SimpleMessageEvent,
} from '../../types';
import {ChangeEventLevel, ChangeEventName} from '../../enums';
import createExperienceFrame from '../createExperienceFrame';
import {extractConsoleExperienceFromUrl, getConsoleExperienceIdentifier} from '.';
import {buildInternalExperienceInfo} from '../commons';

const createConsoleFrame = (
    frameOptions: FrameOptions,
    contentOptions: ConsoleContentOptions,
    controlOptions: ControlOptions,
    allExperienceIdentifiers: Set<string>
): ConsoleFrame => {
    const {url, onChange} = frameOptions;
    const {contextId} = controlOptions || {};

    if (!url) {
        const message = 'Url is required for the experience';
        onChange?.({
            eventName: ChangeEventName.NO_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message,
        }, {frame: null});
        throw new Error(message);
    }

    const experienceFromUrl = extractConsoleExperienceFromUrl(url);
    if (!experienceFromUrl) {
        onChange?.({
            eventName: ChangeEventName.INVALID_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Invalid console experience url',
            data: {
                url,
            },
        }, {frame: null});
        throw new Error('Invalid console experience url');
    }
    const {experienceIdentifier, internalExperience} = buildInternalExperienceInfo(
        experienceFromUrl,
        allExperienceIdentifiers,
        contextId,
        getConsoleExperienceIdentifier
    );

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    const transformContentOptions = (contentOptions: ConsoleContentOptions): TransformedConsoleContentOptions => {
        const {
            locale,
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const unrecognizedContentOptionNames = Object.keys(unrecognizedContentOptions);
        if (Object.keys(unrecognizedContentOptions).length > 0) {
            onChange?.({
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: 'Console content options contain unrecognized properties',
                data: {
                    unrecognizedContentOptions: unrecognizedContentOptionNames,
                },
            }, {frame: null});
            console.warn('Console content options contain unrecognized properties');
        }

        const transformedContentOptions: TransformedConsoleContentOptions = {
            locale,
        };

        return transformedContentOptions;
    };

    const experienceFrame = createExperienceFrame({
        frameOptions,
        contentOptions,
        transformedContentOptions: transformContentOptions(contentOptions),
        controlOptions,
        internalExperience,
        experienceIdentifier
    });

    const _send = async (messageEvent: SimpleMessageEvent): Promise<any> => {
        const targetedMessageEvent: TargetedMessageEvent = {
            ...messageEvent,
            eventTarget: internalExperience,
        };
        const messageResponse = await experienceFrame.internalSend(targetedMessageEvent);
        return messageResponse;
    };

    return {
        send: _send,
        addEventListener: experienceFrame.internalAddEventListener,
    };
};

export default createConsoleFrame;
