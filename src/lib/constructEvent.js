// @flow
import {OUT_GOING_POST_MESSAGE_EVENT_NAMES} from './constants';

export default function constructEvent(eventName: string, payload: Object): Object {
    const validEventNames = new Set(OUT_GOING_POST_MESSAGE_EVENT_NAMES);

    if (!validEventNames.has(eventName)) {
        throw new Error('Unexpected eventName');
    }

    return {
        eventName,
        clientType: 'EMBEDDING',
        payload
    };
}