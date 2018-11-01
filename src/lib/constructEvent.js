// @flow
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {OUT_GOING_POST_MESSAGE_EVENT_NAMES} from './constants';

export default function constructEvent(eventName: string, payload?: Object): Object {
    const validEventNames = new Set(Object.values(OUT_GOING_POST_MESSAGE_EVENT_NAMES));

    if (!validEventNames.has(eventName)) {
        throw new Error('Unexpected eventName');
    }

    return {
        eventName,
        clientType: 'EMBEDDING',
        payload
    };
}