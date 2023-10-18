// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ChangeEventLevel, ChangeEventName, EventData, EventMessageValues, EventNames, MessageEventName} from './types';
import {InternalExperiences} from '@experience/base-experience/types';

export abstract class EmbeddingEvent<
    EventName extends EventNames = EventNames,
    EventMessageValue extends EventMessageValues = EventMessageValues
> {
    public eventName: EventName;
    public message?: EventMessageValue;
    public data?: EventData;
    public eventTarget?: InternalExperiences;

    protected constructor(eventName: EventName, message?: EventMessageValue, data?: EventData) {
        this.eventName = eventName;
        this.message = message;
        this.data = data;
    }
}

export class ChangeEvent<
    EventName extends ChangeEventName,
    EventMessageValue extends EventMessageValues = EventMessageValues
> extends EmbeddingEvent<EventName, EventMessageValue> {
    public eventLevel: ChangeEventLevel;
    constructor(eventName: EventName, eventLevel: ChangeEventLevel, message?: EventMessageValue, data?: EventData) {
        super(eventName, message, data);
        this.eventLevel = eventLevel;
    }
}

export class EmbeddingMessageEvent<
    EventName extends MessageEventName,
    EventMessageValue extends EventMessageValues = EventMessageValues
> extends EmbeddingEvent<EventName, EventMessageValue> {
    public eventName: EventName;

    constructor(eventName: EventName, message?: EventMessageValue, data?: EventData) {
        super(eventName, message, data);
        this.eventName = eventName;
    }
}

export class TargetedMessageEvent<
    EventName extends MessageEventName = MessageEventName,
    EventMessageValue extends EventMessageValues = EventMessageValues
> extends EmbeddingMessageEvent<EventName, EventMessageValue> {
    public eventTarget: InternalExperiences;

    constructor(eventName: EventName, eventTarget: InternalExperiences, message?: EventMessageValue, data?: EventData) {
        super(eventName, message, data);
        this.eventTarget = eventTarget;
    }
}

export class PostMessageEvent<
    EventName extends MessageEventName = MessageEventName,
    EventMessageValue extends EventMessageValues = EventMessageValues
> extends TargetedMessageEvent<EventName, EventMessageValue> {
    public timestamp: number;
    public version: string;
    public eventId: string;

    constructor(
        eventName: EventName,
        eventTarget: InternalExperiences,
        eventId: string,
        timestamp: number,
        version: string,
        message?: EventMessageValue,
        data?: EventData
    ) {
        super(eventName, eventTarget, message, data);
        this.timestamp = timestamp;
        this.version = version;
        this.eventId = eventId;
    }
}

export abstract class ResponseMessage<EventMessageValue extends EventMessageValues = EventMessageValues> {
    public success?: boolean;
    public message?: EventMessageValue;
}

export class SuccessResponse implements ResponseMessage {
    public success = true;
}

export class ErrorResponse implements ResponseMessage {
    public success = false;
    public error?: string;
    public errorCode: string;

    constructor(message: ErrorResponse) {
        this.errorCode = message.errorCode;
        this.error = message?.error;
    }
}

export class DataResponse<EventMessageValue extends EventMessageValues = EventMessageValues>
    implements ResponseMessage<EventMessageValue>
{
    public success = true;
    public message?: EventMessageValue;

    constructor(message?: EventMessageValue) {
        this.message = message;
    }
}
