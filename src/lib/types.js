// @flow
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type EmbeddingOptions = {
    url: string,
    container: HTMLElement | string,
    errorCallback: ?Function,
    loadCallback: ?Function,
    parameters: ?Object,
    width: ?string,
    height: ?string,
    loadingHeight: ?string,
    scrolling: ?string
};