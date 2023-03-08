// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {v4} from 'uuid';
import eventManagerBuilder from './eventManager';
import {FRAME_TIMEOUT, getUrlInfo} from './commons';
import {ChangeEventLevel, ChangeEventName} from './enums';
import {
    EmbeddingContext,
    CreateEmbeddingContext,
    CreateEmbeddingContextFrameOptions,
    EmbedVisual,
    EmbedQSearch,
    EmbedDashboard,
    DashboardFrame,
    VisualFrame,
    QSearchFrame,
    ConsoleFrame,
    FrameOptions,
    VisualContentOptions,
    DashboardContentOptions,
    ConsoleContentOptions,
    QSearchContentOptions,
    EmbedConsole,
    ControlOptions,
} from './types';
import {createControlFrame} from './experiences/control';
import {createVisualFrame} from './experiences/visual';
import {createDashboardFrame} from './experiences/dashboard';
import {createConsoleFrame} from './experiences/console';
import {createQSearchFrame} from './experiences/qsearch';

const createEmbeddingContext: CreateEmbeddingContext = async (frameOptions?: CreateEmbeddingContextFrameOptions): Promise<EmbeddingContext> => {
    const {onChange = null} = frameOptions || {};

    // The contextId is shared with experiences to create a communication context
    // Experiences with not-matching contextId is outside the communication context
    const contextId = v4(); // '00000000-0000-0000-0000-000000000000'; //

    const allExperienceIdentifiers = new Set<string>();

    // The eventManager instance below is passed to all experiences to create a unified event management
    const eventManager = eventManagerBuilder();

    // body element on a page is required to embed the redeem and control frames
    const body = document.getElementsByTagName('body')?.[0];
    if (!body) {
        onChange?.({
            eventName: ChangeEventName.NO_BODY,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'could not locate <body> element in the page',
        });
        throw new Error('could not locate <body> element in the page');
    }

    // CONTROL FRAME

    let controlOptions: ControlOptions;
    const buildControlOptions = (frameOptions: FrameOptions): ControlOptions => {
        if (!controlOptions) {
            const {url} = frameOptions;
            if (!url) {
                return;
            }

            let urlInfo;
            try {
                urlInfo = getUrlInfo(url);
            } catch (error) {
                return;
            }

            const {internalSend} = createControlFrame(
                body,
                {
                    eventManager,
                    urlInfo,
                    contextId,
                },
                onChange
            );
            controlOptions = {
                eventManager,
                sendToControlFrame: internalSend,
                contextId,
                timeout: FRAME_TIMEOUT,
            };
        }
        return controlOptions;
    };

    const validateFrameOptions = (frameOptions: FrameOptions, methodName: string) => {
        if (!frameOptions) {
            const errorMessage = `${methodName} is called without frameOptions`;
            onChange?.({
                eventName: ChangeEventName.NO_FRAME_OPTIONS,
                eventLevel: ChangeEventLevel.ERROR,
                message: errorMessage,
                data: {
                    methodName,
                },
            });
            throw new Error(errorMessage);
        }
        if (typeof frameOptions !== 'object' || Array.isArray(frameOptions)) {
            const errorMessage = `${methodName} is called with non-object frameOptions`;
            onChange?.({
                eventName: ChangeEventName.INVALID_FRAME_OPTIONS,
                eventLevel: ChangeEventLevel.ERROR,
                message: errorMessage,
                data: {
                    methodName,
                    frameOptionsType: Array.isArray(frameOptions) ? 'array' : typeof frameOptions,
                },
            });
            throw new Error(errorMessage);
        }
        const {
            url,
            container,
            width,
            height,
            resizeHeightOnSizeChangedEvent,
            withIframePlaceholder,
            className,
            onChange: onExperienceChange,
            ...unrecognizedFrameOptions
        } = frameOptions;
        const unrecognizedFrameOptionNames = Object.keys(unrecognizedFrameOptions);
        if (unrecognizedFrameOptionNames.length > 0) {
            const warnMessage = `${methodName} is called with unrecognized properties`;
            onExperienceChange?.({
                eventName: ChangeEventName.UNRECOGNIZED_FRAME_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: warnMessage,
                data: {
                    unrecognizedFrameOptions: unrecognizedFrameOptionNames,
                },
            });
            console.warn(warnMessage);
        }
    };
    // EXPERIENCES

    const embedVisual: EmbedVisual = async (frameOptions: FrameOptions, contentOptions: VisualContentOptions): Promise<VisualFrame> => {
        validateFrameOptions(frameOptions, 'embedVisual');
        const controlOptions = buildControlOptions(frameOptions);
        return createVisualFrame(frameOptions, contentOptions, controlOptions, allExperienceIdentifiers);
    };

    const embedDashboard: EmbedDashboard = async (frameOptions: FrameOptions, contentOptions: DashboardContentOptions): Promise<DashboardFrame> => {
        validateFrameOptions(frameOptions, 'embedDashboard');
        const controlOptions = buildControlOptions(frameOptions);
        return createDashboardFrame(frameOptions, contentOptions, controlOptions, allExperienceIdentifiers);
    };

    const embedConsole: EmbedConsole = async (frameOptions: FrameOptions, contentOptions: ConsoleContentOptions): Promise<ConsoleFrame> => {
        validateFrameOptions(frameOptions, 'embedConsole');
        const controlOptions = buildControlOptions(frameOptions);
        return createConsoleFrame(frameOptions, contentOptions, controlOptions, allExperienceIdentifiers);
    };

    const embedQSearchBar: EmbedQSearch = async (frameOptions: FrameOptions, contentOptions: QSearchContentOptions): Promise<QSearchFrame> => {
        validateFrameOptions(frameOptions, 'embedQSearchBar');
        const controlOptions = buildControlOptions(frameOptions);
        return createQSearchFrame(frameOptions, contentOptions, controlOptions, allExperienceIdentifiers);
    };

    const embeddingContext: EmbeddingContext = {
        embedVisual,
        embedDashboard,
        embedConsole,
        embedQSearchBar,
    };

    return embeddingContext;
};

export default createEmbeddingContext;
