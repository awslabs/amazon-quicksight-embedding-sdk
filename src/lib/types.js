// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type EmbeddingOptions = {
    url: string,
    container: HTMLElement | string,
    errorCallback: ?Function,
    loadCallback: ?Function,
    parametersChangeCallback: ?Function,
    selectedSheetChangeCallback: ?Function,
    parameters: ?Object,
    undoRedoDisabled: ?boolean,
    resetDisabled: ?boolean,
    printEnabled: ?boolean,
    sheetTabsDisabled: ?boolean,
    defaultEmbeddingVisualType: ?string,
    width: ?string,
    height: ?string,
    loadingHeight: ?string,
    scrolling: ?string,
    className: ?string,
    locale: ?string,
    footerPaddingEnabled: ?boolean
};