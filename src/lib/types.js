// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type EmbeddingOptions = {
    dashboardId: ?string,
    url: string,
    container: HTMLElement | string,
    errorCallback: ?Function,
    loadCallback: ?Function,
    parametersChangeCallback: ?Function,
    selectedSheetChangeCallback: ?Function,
    parameters: ?Object,
    printEnabled: ?boolean,
    sheetTabsDisabled: ?boolean,
    sheetId: ?string,
    defaultEmbeddingVisualType: ?string,
    iframeResizeOnSheetChange: ?boolean,
    width: ?string,
    height: ?string,
    loadingHeight: ?string,
    scrolling: ?string,
    className: ?string,
    locale: ?string,
    footerPaddingEnabled: ?boolean,
    undoRedoDisabled: ?boolean,
    resetDisabled: ?boolean,
    isQEmbedded: ?boolean,
    qSearchBarOptions: ?QSearchBarOptions
};

export type QSearchBarOptions = {
    expandCallback: ?Function,
    collapseCallback: ?Function,
    iconDisabled: ?boolean,
    topicNameDisabled: ?boolean, 
    themeId: ?string,
    allowTopicSelection: ?boolean
}