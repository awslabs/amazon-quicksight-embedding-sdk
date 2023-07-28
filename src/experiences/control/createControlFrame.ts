// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {FRAME_TIMEOUT, isMessageEvent} from '../../commons';
import createExperienceFrame from '../createExperienceFrame';
import {ChangeEventLevel, ExperienceType, MessageEventName, ChangeEventName} from '../../enums';
import {
    ControlFrame,
    ControlOptions,
    SimpleChangeEventHandler,
    TargetedMessageEvent,
    SimpleMessageEventHandler,
    Experience,
    InternalExperience,
} from '../../types';
import {getControlExperienceBaseUrl, getControlExperienceIdentifier} from '.';
import {getExperienceIdentifier} from '../commons';

const createControlFrame = (
    container: HTMLBodyElement,
    controlOptions: ControlOptions,
    onChange?: SimpleChangeEventHandler,
    onMessage?: SimpleMessageEventHandler
): ControlFrame => {
    const {eventManager, urlInfo, contextId} = controlOptions;

    const experience: Experience = {
        experienceType: ExperienceType.CONTROL,
    };
    const internalExperience: InternalExperience = {
        ...experience,
        contextId,
        discriminator: 0,
    };

    const controlUrl = getControlExperienceBaseUrl(experience, urlInfo).href;

    const {experienceEventListenerBuilder, invokeEventListener} = eventManager;
    const experienceIdentifier = getControlExperienceIdentifier(internalExperience);
    experienceEventListenerBuilder(experienceIdentifier, onMessage);

    const {internalSend, frame} = createExperienceFrame({
        frameOptions: {
            url: controlUrl,
            container,
            width: '0px',
            height: '0px',
            onChange,
        },
        contentOptions: {
            onMessage,
        },
        transformedContentOptions: {},
        controlOptions: {
            eventManager,
            contextId,
            timeout: FRAME_TIMEOUT,
            urlInfo,
        },
        internalExperience,
        experienceIdentifier
    });

    const sendAcknowledgment = (messageEvent: TargetedMessageEvent) => {
        const acknowledgment = {
            eventName: MessageEventName.ACKNOWLEDGE,
            eventTarget: internalExperience,
            message: {
                eventName: messageEvent.eventName,
                eventTarget: messageEvent.eventTarget,
            },
        };
        window.requestIdleCallback?.(() => internalSend(acknowledgment)) || internalSend(acknowledgment);
    };

    const messageListener = (event: MessageEvent) => {
        const _messageEvent = event.data;
        if (isMessageEvent(_messageEvent)) {
            try {
                const incomingExperienceIdentifier = getExperienceIdentifier(_messageEvent.eventTarget);
                invokeEventListener(incomingExperienceIdentifier, _messageEvent);
                sendAcknowledgment(_messageEvent);
            } catch (error) {
                onChange?.({
                    eventName: ChangeEventName.UNRECOGNIZED_EVENT_TARGET,
                    eventLevel: ChangeEventLevel.WARN,
                    message: 'Message with unrecognized event target received',
                    data: {
                        eventTarget: _messageEvent.eventTarget,
                    },
                }, {frame});
                console.warn('Message with unrecognized event target received');
            }
        }
    };
    window.addEventListener('message', messageListener);

    return {
        internalSend,
    };
};

export default createControlFrame;
