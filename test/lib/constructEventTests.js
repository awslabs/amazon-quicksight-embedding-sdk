// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import constructEvent from '../../src/lib/constructEvent';
import {OUT_GOING_POST_MESSAGE_EVENT_NAMES} from '../../src/lib/constants';

import {assert} from 'chai';

describe('constructEvent', () => {
    it('works given a known event type', () => {
        const knownEventName = Object.values(OUT_GOING_POST_MESSAGE_EVENT_NAMES)[0];
        const payload = {hi: 'there'};

        assert.deepEqual(
            constructEvent(knownEventName, payload),
            {
                eventName: knownEventName,
                clientType: 'EMBEDDING',
                payload
            }
        );
    });

    it('errors given an unknown event type', () =>
        assert.throws(() => constructEvent('bogusEvent', {}), 'Unexpected eventName')
    );
});
