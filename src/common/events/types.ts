// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Sheet, Visual, VisualAction} from '../../experiences/dashboard-experience';
import {EmbeddingIFrameElement} from '../iframe';
import {InternalExperiences} from '../../experiences/base-experience';
import {Parameter} from '../types';
import {
    InvokerMessageEventName,
    GetterMessageEventName,
    SetterMessageEventName,
    InfoMessageEventName,
    InfoChangeEventName,
    ErrorChangeEventName,
    WarnChangeEventName,
    ChangeMessageEvents,
    GetterMessageEvents,
    SetterMessageEvents,
    InfoMessageEvents,
    InvokerMessageEvents,
} from './messages';

export const ChangeEventName = {
    ...InfoChangeEventName,
    ...ErrorChangeEventName,
    ...WarnChangeEventName,
} as const;

export type ChangeEventName = (typeof ChangeEventName)[keyof typeof ChangeEventName];

export const MessageEventName = {
    ...InfoMessageEventName,
    ...SetterMessageEventName,
    ...GetterMessageEventName,
    ...InvokerMessageEventName,
} as const;

export type MessageEventName = (typeof MessageEventName)[keyof typeof MessageEventName];

export const ChangeEventLevel = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    WARN: 'WARN',
} as const;

export type ChangeEventLevel = (typeof ChangeEventLevel)[keyof typeof ChangeEventLevel];

export type EventNames = MessageEventName | ChangeEventName;

export type EventMessageValues =
    | string
    | {height?: string}
    | Visual[]
    | number
    | EmbeddingIFrameElement
    | InternalExperiences
    | Record<string, unknown>
    | Parameter[]
    | VisualAction[]
    | Sheet[]
    | undefined
    | {success?: boolean};

export type EventData = Record<
    string,
    string | number | string[] | InternalExperiences | {frame?: EmbeddingIFrameElement} | unknown
>;

export type EmbeddingEvents =
    | ChangeMessageEvents
    | GetterMessageEvents
    | SetterMessageEvents
    | InfoMessageEvents
    | InvokerMessageEvents;
