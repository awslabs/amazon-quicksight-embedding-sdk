// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type {ThemeConfiguration} from '@aws-sdk/client-quicksight';

export type Primitives = string | number | boolean;

export type CreatePostRequestOptions = {
    src: string;
    container: HTMLElement;
    target: string;
    payload: {[key: string]: string};
};

export type PostRequest = {
    remove: () => void;
};

export type ParameterValue = string | number;

export interface Parameter {
    Name: string;
    Values: ParameterValue[];
}

export type ParametersAsObject = Record<string, Primitives | Primitives[]>;

export type CleanUpCallback = () => void;

export type ThemeOptions = {
    themeArn?: string;
    themeOverride?: ThemeConfiguration;
    preloadThemes?: string[];
};
