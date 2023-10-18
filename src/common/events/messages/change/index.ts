import {ChangeEvent} from '@common/events/events';

export const InfoChangeEventName = {
    FRAME_STARTED: 'FRAME_STARTED',
    FRAME_MOUNTED: 'FRAME_MOUNTED',
    FRAME_LOADED: 'FRAME_LOADED',
    FRAME_REMOVED: 'FRAME_REMOVED',
} as const;

export type InfoChangeEventName = (typeof InfoChangeEventName)[keyof typeof InfoChangeEventName];

export const ErrorChangeEventName = {
    FRAME_NOT_CREATED: 'FRAME_NOT_CREATED',
    NO_BODY: 'NO_BODY',
    NO_CONTAINER: 'NO_CONTAINER',
    INVALID_CONTAINER: 'INVALID_CONTAINER',
    NO_URL: 'NO_URL',
    INVALID_URL: 'INVALID_URL',
    NO_FRAME_OPTIONS: 'NO_FRAME_OPTIONS',
    INVALID_FRAME_OPTIONS: 'INVALID_FRAME_OPTIONS',
} as const;

export type ErrorChangeEventName = (typeof ErrorChangeEventName)[keyof typeof ErrorChangeEventName];

export const WarnChangeEventName = {
    UNRECOGNIZED_CONTENT_OPTIONS: 'UNRECOGNIZED_CONTENT_OPTIONS',
    UNRECOGNIZED_FRAME_OPTIONS: 'UNRECOGNIZED_FRAME_OPTIONS',
    UNRECOGNIZED_EVENT_TARGET: 'UNRECOGNIZED_EVENT_TARGET',
} as const;

export type WarnChangeEventName = (typeof WarnChangeEventName)[keyof typeof WarnChangeEventName];

export type ChangeMessageEvents =
    | ChangeEvent<typeof InfoChangeEventName.FRAME_LOADED, string>
    | ChangeEvent<typeof InfoChangeEventName.FRAME_MOUNTED, string>
    | ChangeEvent<typeof InfoChangeEventName.FRAME_STARTED, string>
    | ChangeEvent<typeof InfoChangeEventName.FRAME_REMOVED, string>
    | ChangeEvent<typeof WarnChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS, string>
    | ChangeEvent<typeof WarnChangeEventName.UNRECOGNIZED_FRAME_OPTIONS, string>
    | ChangeEvent<typeof WarnChangeEventName.UNRECOGNIZED_EVENT_TARGET, string>
    | ChangeEvent<typeof ErrorChangeEventName.FRAME_NOT_CREATED, string>
    | ChangeEvent<typeof ErrorChangeEventName.NO_BODY, string>
    | ChangeEvent<typeof ErrorChangeEventName.NO_CONTAINER, string>
    | ChangeEvent<typeof ErrorChangeEventName.INVALID_CONTAINER, string>
    | ChangeEvent<typeof ErrorChangeEventName.INVALID_URL, string>
    | ChangeEvent<typeof ErrorChangeEventName.NO_URL, string>
    | ChangeEvent<typeof ErrorChangeEventName.NO_FRAME_OPTIONS, string>
    | ChangeEvent<typeof ErrorChangeEventName.INVALID_FRAME_OPTIONS, string>;
