// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {EventManager, ExperienceEventListener, SimpleMessageEventHandler, TargetedMessageEvent} from './types';

const eventManagerBuilder = (): EventManager => {
    const eventListeners = new Map();

    const addEventListener = (experienceIdentifier: string, listener: SimpleMessageEventHandler): void => {
        if (!experienceIdentifier) {
            return;
        }
        if (typeof listener !== 'function') {
            return;
        }
        if (!eventListeners.has(experienceIdentifier)) {
            eventListeners.set(experienceIdentifier, []);
        }
        const experienceIdentifierSpecificListeners = eventListeners.get(experienceIdentifier);
        experienceIdentifierSpecificListeners.push(listener);
    };

    const invokeEventListener = (experienceIdentifier: string, data: TargetedMessageEvent): void => {
        if (!eventListeners.has(experienceIdentifier)) {
            return;
        }
        const experienceIdentifierSpecificListeners = eventListeners.get(experienceIdentifier);
        experienceIdentifierSpecificListeners.forEach((listener: SimpleMessageEventHandler) => {
            listener(data);
        });
    };

    const removeEventListener = (experienceIdentifier: string, listener: SimpleMessageEventHandler): void => {
        if (!eventListeners.has(experienceIdentifier)) {
            return;
        }
        const experienceIdentifierSpecificListeners = eventListeners.get(experienceIdentifier);
        const remainingListeners = experienceIdentifierSpecificListeners.filter(
            (listenerItem: SimpleMessageEventHandler) => listenerItem !== listener
        );
        eventListeners.set(experienceIdentifier, remainingListeners);
    };

    const experienceEventListenerBuilder = (experienceIdentifier: string, onMessage?: SimpleMessageEventHandler): ExperienceEventListener => {
        const addExperienceEventListener = (listener: SimpleMessageEventHandler) => {
            return addEventListener(experienceIdentifier, listener);
        };
        if (onMessage) {
            addExperienceEventListener(onMessage);
        }
        return {
            addExperienceEventListener,
            invokeExperienceEventListener: (data: TargetedMessageEvent) => {
                return invokeEventListener(experienceIdentifier, data);
            },
            removeExperienceEventListener: (listener: SimpleMessageEventHandler) => {
                return removeEventListener(experienceIdentifier, listener);
            },
        };
    };

    return {
        addEventListener,
        invokeEventListener,
        removeEventListener,
        experienceEventListenerBuilder,
    };
};

export default eventManagerBuilder;
