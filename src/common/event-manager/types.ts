// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ExperienceFrameMetadata} from '../embedding-context';
import {EmbeddingEvents} from '../events';

export type ExperienceIdentifier = string;

export type EventListener = (event: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => void;
