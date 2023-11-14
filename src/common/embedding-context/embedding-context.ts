// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {v4} from 'uuid';
import {
    EmbeddingContextFrameOptions,
    ExperienceFrameMetadata,
    IEmbeddingContext,
} from '@common/embedding-context/types';
import {FrameOptions} from '@experience/base-experience/types';
import {ControlOptions} from '@experience/control-experience/types';
import {VisualContentOptions} from '@experience/visual-experience/types';
import {VisualExperience} from '@experience/visual-experience/visual-experience';
import {DashboardContentOptions} from '@experience/dashboard-experience/types';
import {ConsoleContentOptions} from '@experience/console-experience/types';
import {QSearchContentOptions} from '@experience/q-search-experience/types';
import {ConsoleExperience} from '@experience/console-experience/console-experience';
import {DashboardExperience} from '@experience/dashboard-experience/dashboard-experience';
import {QSearchExperience} from '@experience/q-search-experience/q-search-experience';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents} from '@common/events/types';
import {ChangeEvent} from '@common/events/events';
import {ControlExperience} from '@experience/control-experience/control-experience';
import {EventManager} from '@common/event-manager/event-manager';
import {DefaultLogger, LogProvider} from '../log-provider/log-provider';

/**
 * The embedding context creates an additional zero-pixel iframe and appends it into the body element on the page to centralize communication between the SDK and the embedded QuickSight content
 */
export class EmbeddingContext implements IEmbeddingContext {
    private readonly experienceIdentifiers: Set<string>;
    private readonly eventManager: EventManager;
    private readonly contextId: string;
    private readonly contextOnChange;
    private controlOptions?: ControlOptions;
    private readonly logger: LogProvider;

    constructor(contextFrameOptions: EmbeddingContextFrameOptions) {
        // The contextId is shared with experiences to create a communication context
        // Experiences with not-matching contextId is outside the communication context
        this.contextId = v4();
        this.experienceIdentifiers = new Set();

        // The eventManager instance below is passed to all experiences to create a unified event management
        this.eventManager = new EventManager();
        this.contextOnChange = contextFrameOptions.onChange;
        this.logger = new DefaultLogger();
    }

    public embedVisual = async (
        frameOptions: FrameOptions,
        contentOptions: VisualContentOptions = {}
    ): Promise<VisualExperience> => {
        this.validateFrameOptions(frameOptions, 'embedVisual');
        const controlOptions = this.buildControlOptions(frameOptions);

        return new VisualExperience(
            frameOptions,
            contentOptions,
            controlOptions,
            this.experienceIdentifiers
        ).setLogProvider(this.logger);
    };

    public embedDashboard = async (
        frameOptions: FrameOptions,
        contentOptions: DashboardContentOptions = {}
    ): Promise<DashboardExperience> => {
        this.validateFrameOptions(frameOptions, 'embedDashboard');
        const controlOptions = this.buildControlOptions(frameOptions);
        return new DashboardExperience(
            frameOptions,
            contentOptions,
            controlOptions,
            this.experienceIdentifiers
        ).setLogProvider(this.logger);
    };

    public embedConsole = async (
        frameOptions: FrameOptions,
        contentOptions: ConsoleContentOptions = {}
    ): Promise<ConsoleExperience> => {
        this.validateFrameOptions(frameOptions, 'embedConsole');
        const controlOptions = this.buildControlOptions(frameOptions);
        return new ConsoleExperience(
            frameOptions,
            contentOptions,
            controlOptions,
            this.experienceIdentifiers
        ).setLogProvider(this.logger);
    };

    public embedQSearchBar = async (
        frameOptions: FrameOptions,
        contentOptions: QSearchContentOptions = {}
    ): Promise<QSearchExperience> => {
        this.validateFrameOptions(frameOptions, 'embedQSearchBar');
        const controlOptions = this.buildControlOptions(frameOptions);
        return new QSearchExperience(
            frameOptions,
            contentOptions,
            controlOptions,
            this.experienceIdentifiers
        ).setLogProvider(this.logger);
    };

    private validateFrameOptions = (frameOptions: FrameOptions, methodName: string) => {
        if (!frameOptions) {
            const errorMessage = `${methodName} is called without frameOptions`;
            this.onChange(
                new ChangeEvent(
                    ChangeEventName.NO_FRAME_OPTIONS,
                    ChangeEventLevel.ERROR,
                    `${methodName} is called without frameOptions`,
                    {
                        methodName,
                    }
                ),
                {frame: null}
            );
            throw new Error(errorMessage);
        }

        if (typeof frameOptions !== 'object' || Array.isArray(frameOptions)) {
            const errorMessage = `${methodName} is called with non-object frameOptions`;
            this.onChange(
                new ChangeEvent(ChangeEventName.INVALID_FRAME_OPTIONS, ChangeEventLevel.ERROR, errorMessage, {
                    methodName,
                    frameOptionsType: Array.isArray(frameOptions) ? 'array' : typeof frameOptions,
                }),
                {frame: null}
            );
            throw new Error(errorMessage);
        }

        const recognizedKeys = [
            'url',
            'container',
            'width',
            'height',
            'resizeHeightOnSizeChangedEvent',
            'withIframePlaceholder',
            'onChange',
            'className',
        ];

        const unrecognizedFrameOptionNames = Object.keys(frameOptions).filter(key => !recognizedKeys.includes(key));

        if (unrecognizedFrameOptionNames.length > 0) {
            const warnMessage = `${methodName} is called with unrecognized properties`;
            frameOptions.onChange?.(
                new ChangeEvent(ChangeEventName.UNRECOGNIZED_FRAME_OPTIONS, ChangeEventLevel.WARN, warnMessage, {
                    unrecognizedFrameOptions: unrecognizedFrameOptionNames,
                }),
                {frame: null}
            );

            this.logger?.warn(warnMessage);
        }
    };

    private buildControlOptions = (frameOptions: FrameOptions): ControlOptions => {
        if (!this.controlOptions) {
            if (!frameOptions.url) {
                throw new Error('URL is missing in frame options, but is a required field');
            }

            const urlInfo = this.getControlUrlInfo(frameOptions.url);

            const controlFrame = new ControlExperience(
                this.getBodyElement(),
                {
                    eventManager: this.eventManager,
                    urlInfo,
                    contextId: this.contextId,
                },
                this.onChange
            ).setLogger(this.logger);

            this.controlOptions = {
                eventManager: this.eventManager,
                sendToControlFrame: controlFrame.send,
                contextId: this.contextId,
                timeout: ControlExperience.FRAME_TIMEOUT,
                urlInfo,
            };
        }

        return this.controlOptions;
    };

    private onChange = (event: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
        if (this.contextOnChange) {
            this.contextOnChange(event, metadata);
        }
    };

    private getControlUrlInfo = (url: string) => {
        const matches: Array<string> = /^(https:\/\/[^/]+)\/(embedding|embed)\/([^/]+)\/[^?]+\?(.*)/i.exec(url) || [];

        if (matches?.length < 4) {
            throw new Error(`Invalid embedding url: "${url}"`);
        }

        return {
            sessionId: matches[3],
            host: matches[1],
            urlSearchParams: new URLSearchParams(matches[4]),
        };
    };

    private getBodyElement = () => {
        // body element on a page is required to embed the redeem and control frames
        const body = document.getElementsByTagName('body')?.[0];

        if (!body) {
            const message = 'could not locate <body> element in the page';
            this.onChange(new ChangeEvent(ChangeEventName.NO_BODY, ChangeEventLevel.ERROR, message), {frame: null});

            throw new Error(message);
        }

        return body;
    };
}

export const createEmbeddingContext = async (frameOptions: EmbeddingContextFrameOptions = {}) => {
    return new EmbeddingContext(frameOptions);
};
