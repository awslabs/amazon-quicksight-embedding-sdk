// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ExperienceIdentifier, EventListener} from './types';
import {EmbeddingEvents} from '../events';
import {CleanUpCallback} from '../types';

/**
 * Manages the event listeners for the experiences within an embedding context
 */
export class EventManager {
    private eventListeners: Map<ExperienceIdentifier, EventListener[]>;
    private cleanUpCallbacks: Map<ExperienceIdentifier, CleanUpCallback[]>;

    constructor() {
        this.eventListeners = new Map();
        this.cleanUpCallbacks = new Map();
    }

    public addEventListener = (experienceId: ExperienceIdentifier, listener: EventListener, cleanUp?: boolean) => {
        if (!experienceId) {
            throw new Error('Experience identifier is required when calling addEventListener');
        }

        if (typeof listener !== 'function') {
            throw new Error('Invalid type provided for event listener');
        }

        const experienceIdentifierSpecificListeners = this.eventListeners.get(experienceId);

        if (cleanUp) {
            this.addEventListenerForCleanup(experienceId, () => this.removeEventListener(experienceId, listener));
        }

        if (!experienceIdentifierSpecificListeners) {
            this.eventListeners.set(experienceId, [listener]);
            return this;
        }

        experienceIdentifierSpecificListeners.push(listener);
        return this;
    };

    public invokeEventListener = (experienceId: ExperienceIdentifier, event: EmbeddingEvents) => {
        const experienceIdentifierSpecificListeners = this.eventListeners.get(experienceId);

        if (!experienceIdentifierSpecificListeners) {
            throw new Error(`Unable to find experience specific event listeners: ${experienceId}`);
        }

        experienceIdentifierSpecificListeners.forEach((listener: EventListener) => {
            listener(event);
        });

        return this;
    };

    public removeEventListener = (experienceId: ExperienceIdentifier, listener: EventListener) => {
        const experienceIdentifierSpecificListeners = this.eventListeners.get(experienceId);

        if (!experienceIdentifierSpecificListeners) {
            throw new Error(`Unable to find experience specific event listeners: ${experienceId}`);
        }

        const updateEventListeners = experienceIdentifierSpecificListeners.filter(
            listenerItem => listenerItem !== listener
        );

        this.eventListeners.set(experienceId, updateEventListeners);

        return this;
    };

    public addEventListenerForCleanup = (experienceId: ExperienceIdentifier, cleanupCallback: CleanUpCallback) => {
        const experienceIdentifierSpecificListenersForCleanup = this.cleanUpCallbacks.get(experienceId) ?? [];
        experienceIdentifierSpecificListenersForCleanup.push(cleanupCallback);

        this.cleanUpCallbacks.set(experienceId, experienceIdentifierSpecificListenersForCleanup);
    };

    public cleanUpCallbacksForExperience = (experienceId: ExperienceIdentifier) => {
        const experienceIdentifierSpecificListenersForCleanup = this.cleanUpCallbacks.get(experienceId);

        if (experienceIdentifierSpecificListenersForCleanup) {
            experienceIdentifierSpecificListenersForCleanup.forEach(callback => callback());
            this.cleanUpCallbacks.delete(experienceId);
            this.eventListeners.set(experienceId, []);
        }
    };
}
