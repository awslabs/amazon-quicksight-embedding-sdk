// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface EmbeddingIFrameElement extends HTMLIFrameElement {
    loading: string;
}

export type IframeOptions = {
    id: string;
    src: string;
    container: HTMLElement;
    width?: string;
    height?: string;
    onLoad?: (event: Event) => void;
    loading?: 'eager' | 'lazy';
    withIframePlaceholder?: boolean | HTMLElement;
    payload?: {[key: string]: string};
    className?: string;
};
