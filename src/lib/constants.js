// @flow
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const OUT_GOING_POST_MESSAGE_EVENT_NAMES = {
    ESTABLISH_MESSAGE_CHANNEL: 'establishMessageChannel',
    UPDATE_PARAMETER_VALUES: 'updateParameterValues'
};

export const IN_COMING_POST_MESSAGE_EVENT_NAMES = {
    LOAD: 'load',
    ERROR: 'error',
    RESIZE_EVENT: 'RESIZE_EVENT'
};

// this is a mapping of event names we use internally to the event names we expose to clients
export const CLIENT_FACING_EVENT_NAMES = {
    load: 'load',
    error: 'error',
    RESIZE_EVENT: 'resize'
};

export const DASHBOARD_SIZE_OPTIONS = {
    AUTO_FIT: 'AutoFit',
};