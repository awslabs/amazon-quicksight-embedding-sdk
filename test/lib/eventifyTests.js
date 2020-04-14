// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import eventify from '../../src/lib/eventify';

import {assert} from 'chai';

describe('eventify', () => {
    it('can listen to events', () => {
        let obj = eventify();
        obj.on('answer', (firstValue, secondValue) => {
            assert.equal(firstValue, 42, 'First value is ok');
            assert.equal(secondValue, 'what', 'Second value is ok');
        });

        obj.trigger('answer', 42, 'what');
    });

    it('can remove all listeners', () => {
        let obj = eventify();
        obj.on('answer', () => {
            assert.fail('we are unsubscribed');
        });

        // remove all listeners;
        obj.off('answer');

        obj.trigger('answer');

        assert.isOk(true, 'Should not trigger');
    });

    it('can remove one listeners', () => {
        let obj = eventify();

        obj.on('answer', fail);
        obj.on('answer', succeed);

        // remove all listeners;
        obj.off('answer', fail);

        let succeedCalled = false;
        obj.trigger('answer');

        assert.isOk(succeedCalled, 'this one is not removed');

        function fail() {
            assert.fail('we are unsubscribed');
        }

        function succeed() {
            succeedCalled = true;
        }
    });

    it('dedupes listeners', () => {
        let obj = eventify();

        let calledCount = 0;

        obj.on('event', countCall);
        obj.on('event', countCall);

        obj.trigger('event');

        assert.equal(calledCount, 1, 'called just once');

        function countCall() {
            calledCount += 1;
        }
    });

    it('augments object', () => {
        let obj = {};
        eventify(obj);

        assert.isFunction(obj.on, 'on is here');
        assert.isFunction(obj.trigger, 'trigger is here');
        assert.isFunction(obj.off, 'off is here');
    });

    it('does not override existing properties', () => {
        assert.throws(() => eventify({on() {}}), 'Cannot eventify object');
        assert.throws(() => eventify({off() {}}), 'Cannot eventify object');
        assert.throws(() => eventify({trigger() {}}), 'Cannot eventify object');
    });
});