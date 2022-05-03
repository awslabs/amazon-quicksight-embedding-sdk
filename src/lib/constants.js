// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const OUT_GOING_POST_MESSAGE_EVENT_NAMES = {
    ESTABLISH_MESSAGE_CHANNEL: 'establishMessageChannel',
    UPDATE_PARAMETER_VALUES: 'updateParameterValues',
    DEFAULT_EMBEDDING_VISUAL_TYPE_OPTIONS: 'updateDefaultEmbeddingVisualType',
    NAVIGATE_TO_DASHBOARD: 'navigateToDashboard',
    GET_ACTIVE_PARAMETER_VALUES: 'getActiveParameterValues',
    NAVIGATE_TO_SHEET: 'navigateToSheet',
    GET_SHEETS: 'getSheets',
    PRINT: 'initiatePrint',
    HIDE_Q_BAR: 'hideQSearchBar',
    SET_Q_BAR_QUESTION: 'setQBarQuestion'
};

export const IN_COMING_POST_MESSAGE_EVENT_NAMES = {
    LOAD: 'load',
    ERROR: 'error',
    RESIZE_EVENT: 'RESIZE_EVENT',
    SHOW_MODAL_EVENT: 'SHOW_MODAL_EVENT'
};

// this is a mapping of event names we use internally to the event names we expose to clients
export const CLIENT_FACING_EVENT_NAMES = {
    load: 'load',
    error: 'error',
    parametersChange: 'parametersChange',
    selectedSheetChange: 'selectedSheetChange',
    RESIZE_EVENT: 'resize',
    SHOW_MODAL_EVENT: 'SHOW_MODAL_EVENT',
    GET_ACTIVE_PARAMETER_VALUES: 'GET_ACTIVE_PARAMETER_VALUES',
    GET_SHEETS: 'GET_SHEETS',
    SHOW_Q_BAR: 'showQSearchBar',
    HIDE_Q_BAR: 'hideQSearchBar',
    RESIZE_Q_BAR: 'resizeQSearchBar'
};

export const DASHBOARD_SIZE_OPTIONS = {
    AUTO_FIT: 'AutoFit',
};

export const DEFAULT_EMBEDDING_VISUAL_TYPE_OPTIONS = {
    AUTO_GRAPH: 'AUTO_GRAPH',
    TABLE: 'TABLE',
};
