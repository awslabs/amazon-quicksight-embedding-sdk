// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Adds `on()`, `off()`, and `trigger()` methods to an object.
 * Consumers can use `on()` function to subscribe to events, use `off()` to unsubscribe
 * and use `trigger()` to trigger event.
 */
export default function eventify(object: Object): Object {
    if (!object) {
        object = {};
    }

    assertObjectHasNoReservedKeywords(object);

    const listeners = new Map(); // eventName -> Set() of listeners

    object.on = on;
    object.off = off;
    object.trigger = trigger;

    return object;

    function on(eventName: string, callback: Function): void {
        let eventListeners = listeners.get(eventName);
        if (!eventListeners) {
            eventListeners = new Set();
            listeners.set(eventName, eventListeners);
        }

        eventListeners.add(callback);
    }

    function trigger(eventName: string, ...args): void {
        const eventListeners = listeners.get(eventName);
        if (eventListeners) {
            eventListeners.forEach(listener => listener.apply(null, args));
        }
    }

    function off(eventName: string, callback: Function): Object {
        if (!callback) {
            // we want to unsubscribe from all events
            listeners.delete(eventName);
            return object;
        }

        let eventListeners = listeners.get(eventName);
        if (!eventListeners) {
            // no listeners, nothing to unsubscribe from
            return object;
        }
        // remove this specific callback from this event
        eventListeners.delete(callback);

        return object;
    }
}

function assertObjectHasNoReservedKeywords(object: Object): void {
    ['on', 'trigger', 'off'].forEach(keyword => {
        if (keyword in object) {
            throw new Error('Cannot eventify object that has `' + keyword + '()` method on it');
        }
    });
}