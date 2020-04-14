// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {OUT_GOING_POST_MESSAGE_EVENT_NAMES} from './constants';

export default function constructEvent(eventName: string, payload?: Object): Object {
    const isValidEventName = Object
        .keys(OUT_GOING_POST_MESSAGE_EVENT_NAMES)
        .some(k => OUT_GOING_POST_MESSAGE_EVENT_NAMES[k] === eventName);

    if (!isValidEventName) {
        throw new Error('Unexpected eventName');
    }

    return {
        eventName,
        clientType: 'EMBEDDING',
        payload
    };
}
