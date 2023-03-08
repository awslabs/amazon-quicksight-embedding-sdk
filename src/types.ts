// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ChangeEventLevel, ExperienceType, MessageEventName, InfoChangeEventName, WarnChangeEventName, ErrorChangeEventName} from './enums';

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

export type CreateIframeOptions = {
    id: string;
    src: string;
    container: HTMLElement;
    width?: string;
    height?: string;
    onLoad?: (event: Event) => void;
    loading?: boolean;
    withIframePlaceholder?: boolean | HTMLElement;
    payload?: {[key: string]: string};
    className?: string;
};

export interface EmbeddingIFrameElement extends HTMLIFrameElement {
    loading?: boolean;
}

// createEmbeddingContext

export type CreateEmbeddingContextFrameOptions = {
    onChange?: SimpleChangeEventHandler;
};

export type CreateEmbeddingContext = (frameOptions?: CreateEmbeddingContextFrameOptions) => Promise<EmbeddingContext>;

export type EmbeddingContext = {
    embedDashboard: EmbedDashboard;
    embedVisual: EmbedVisual;
    embedQSearchBar: EmbedQSearch;
    embedConsole: EmbedConsole;
};

// experiences:console

export interface ConsoleExperience extends BaseExperience {
    experienceType: ExperienceType.CONSOLE;
}

export interface InternalConsoleExperience extends ConsoleExperience {
    contextId: string;
}

export interface ConsoleContentOptions extends BaseContentOptions {
    locale?: string;
}

export type TransformedConsoleContentOptions = ConsoleContentOptions;

export type ConsoleFrame = BaseFrame;

export type EmbedConsole = (frameOptions: FrameOptions, contentOptions?: ConsoleContentOptions) => Promise<ConsoleFrame>;

// experiences:context

export interface ContextExperience extends BaseExperience {
    experienceType: ExperienceType.CONTEXT;
}

export interface InternalContextExperience extends ContextExperience {
    contextId: string;
}

// experiences:control

export interface ControlExperience extends BaseExperience {
    experienceType: ExperienceType.CONTROL;
}

export interface InternalControlExperience extends ControlExperience {
    contextId: string;
}

export type ControlFrame = {
    internalSend: InternalSend;
};

// experiences:dashboard

export interface DashboardExperience extends BaseExperience {
    experienceType: ExperienceType.DASHBOARD;
    dashboardId: string;
}

export interface InternalDashboardExperience extends DashboardExperience {
    contextId: string;
}

export interface ToolbarOption {
    show?: true; // absence implies true
}

export interface ExportToolbarOption extends ToolbarOption {
    print?: boolean;
}

export interface ToolbarOptions {
    export?: boolean | ExportToolbarOption;
    undoRedo?: boolean | ToolbarOption;
    reset?: boolean | ToolbarOption;
}

export interface AttributionOptions {
    overlayContent?: boolean;
}

export interface SheetOptions {
    initialSheetId?: string;
    singleSheet?: boolean;
    emitSizeChangedEventOnSheetChange?: boolean;
}

export type ParameterValue = Omit<Primitives, 'boolean'>;

export interface Parameter {
    Name: string;
    Values: ParameterValue[]
}

export interface DashboardContentOptions extends BaseContentOptions {
    parameters?: Parameter[];
    locale?: string;
    attributionOptions?: AttributionOptions;
    toolbarOptions?: ToolbarOptions;
    sheetOptions?: SheetOptions;
}

export type ParametersAsObject = Record<string, ParameterValue | ParameterValue[]>;
export interface TransformedDashboardContentOptions extends BaseContentOptions {
    parameters?: ParametersAsObject;
    locale?: string;
    sheetId?: string | undefined;
    footerPaddingEnabled?: boolean;
    undoRedoDisabled?: boolean;
    printEnabled?: boolean;
    hideAutoRefresh?: boolean;
    resetDisabled?: boolean;
    sheetTabsDisabled?: boolean;
    resizeOnSheetChange?: boolean;
}

export interface SuccessResponseMessage {
    success: true;
}

export interface FailureResponseMessage {
    success: false;
    errorCode: string;
    error?: string;
}

export type ResponseMessage = SuccessResponseMessage | FailureResponseMessage;

export type NavigateToDashboardOptions = {
    parameters?: Parameter[];
};

export type EmbedDashboard = (frameOptions: FrameOptions, contentOptions?: DashboardContentOptions) => Promise<DashboardFrame>;

export interface Sheet {
    Name: string;
    SheetId: string;
}

// Getters
export type GetParameters = () => Promise<Parameter[]>;
export type GetSheets = () => Promise<Sheet[]>;
export type GetSelectedSheetId = () => Promise<string>;

// Setters
export type SetParameters = (parameters: Parameter[]) => Promise<ResponseMessage>;
export type SetSelectedSheetId = (sheetId: string) => Promise<ResponseMessage>;

// Invokers
export type InitiatePrint = () => Promise<ResponseMessage>;
export type Undo = () => Promise<ResponseMessage>;
export type Redo = () => Promise<ResponseMessage>;
export type Reset = () => Promise<ResponseMessage>;
export type NavigateToDashboard = (dashboardId: string, options?: NavigateToDashboardOptions) => Promise<ResponseMessage>;

export interface DashboardFrame extends BaseFrame {
    getParameters: GetParameters;
    getSheets: GetSheets;
    getSelectedSheetId: GetSelectedSheetId;
    setParameters: SetParameters;
    setSelectedSheetId: SetSelectedSheetId;
    initiatePrint: InitiatePrint;
    undo: Undo;
    redo: Redo;
    reset: Reset;
    navigateToDashboard: NavigateToDashboard;
}

// experiences:qsearch

export interface QSearchExperience extends BaseExperience {
    experienceType: ExperienceType.QSEARCH;
}

export interface InternalQSearchExperience extends QSearchExperience {
    contextId: string;
}

export interface QSearchContentOptions extends BaseContentOptions {
    hideIcon?: boolean;
    hideTopicName?: boolean;
    theme?: string;
    allowTopicSelection?: boolean;
}

export interface TransformedQSearchContentOptions extends BaseContentOptions {
    qBarIconDisabled?: boolean;
    qBarTopicNameDisabled?: boolean;
    themeId?: string;
    allowTopicSelection?: boolean;
}

export type EmbedQSearch = (frameOptions: FrameOptions, contentOptions?: QSearchContentOptions) => Promise<QSearchFrame>;

export type SetQuestion = (question: string) => Promise<ResponseMessage>;
export type Close = () => Promise<ResponseMessage>;

export interface QSearchFrame extends BaseFrame {
    setQuestion: SetQuestion;
    close: Close;
}

// experiences:visual

export interface VisualExperience extends BaseExperience {
    experienceType: ExperienceType.VISUAL;
    dashboardId: string;
    sheetId: string;
    visualId: string;
}

export interface InternalVisualExperience extends VisualExperience {
    contextId: string;
}

export interface VisualContentOptions extends BaseContentOptions {
    locale?: string;
    parameters?: Parameter[];
    fitToIframeWidth?: boolean;
}

export type TransformedVisualContentOptions = VisualContentOptions;

export type EmbedVisual = (frameOptions: FrameOptions, contentOptions?: VisualContentOptions) => Promise<VisualFrame>;

export interface VisualFrame extends BaseFrame {
    setParameters: SetParameters;
    reset: Reset;
}

// common

export type BuildExperienceUrlOptions = {
    [key: string]: Primitives | Primitives[];
};

// SimpleChangeEvent is the change event that is exposed to the 3P
export interface InfoChangeEvent {
    eventName: InfoChangeEventName;
    eventLevel: ChangeEventLevel.INFO;
    message?: string;
    data?: any;
}

export interface WarnChangeEvent {
    eventName: WarnChangeEventName;
    eventLevel: ChangeEventLevel.WARN;
    message?: string;
    data?: any;
}

export interface ErrorChangeEvent {
    eventName: ErrorChangeEventName;
    eventLevel: ChangeEventLevel.ERROR;
    message?: string;
    data?: any;
}

export type SimpleChangeEvent = InfoChangeEvent | WarnChangeEvent | ErrorChangeEvent;

// SimpleMessageEvent is the message event that is exposed to the 3P
export interface SimpleMessageEvent {
    eventName: MessageEventName;
    message?: any;
}

// TargetedMessageEvent decorates the SimpleMessageEvent with eventTarget
// Each experience adds their experience signature to the message
export interface TargetedMessageEvent extends SimpleMessageEvent {
    eventTarget: InternalExperience;
}

// PostMessageEvent decorates the TargetedMessageEvent with timestamp and the version
// It is used as payload of window.postMessage method
export interface PostMessageEvent extends TargetedMessageEvent {
    eventId: string;
    timestamp: number;
    version: string;
}

export type ExperienceFrameMetadata = {
    frame: EmbeddingIFrameElement;
};
export type SimpleChangeEventHandler = (message: SimpleChangeEvent, metadata?: ExperienceFrameMetadata) => void;
export type SimpleMessageEventHandler = (message: SimpleMessageEvent, metadata?: ExperienceFrameMetadata) => void;

export type InterceptMessage = (messageEvent: SimpleMessageEvent, metadata: ExperienceFrameMetadata) => void;

export type FrameOptions = {
    url: string;
    container: string | HTMLElement;
    width?: string;
    height?: string;
    resizeHeightOnSizeChangedEvent?: boolean
    withIframePlaceholder?: boolean | HTMLElement;
    className?: string;
    onChange?: SimpleChangeEventHandler;
};

export type UrlInfo = {
    guid: string;
    host: string;
    urlSearchParams?: URLSearchParams;
};

export type ExperienceEventListenerBuilder = (experienceIdentifier: string, onMessage?: SimpleMessageEventHandler) => ExperienceEventListener;

export type EventManager = {
    addEventListener: (experienceIdentifier: string, listener: SimpleMessageEventHandler) => void;
    invokeEventListener: (experienceIdentifier: string, data: TargetedMessageEvent) => void;
    removeEventListener: (experienceIdentifier: string, listener: SimpleMessageEventHandler) => void;
    experienceEventListenerBuilder: ExperienceEventListenerBuilder;
};

export type ControlOptions = {
    eventManager: EventManager;
    contextId: string;
    areCookiesDisabled?: boolean;
    urlInfo?: UrlInfo;
    timeout?: number;
    sendToControlFrame?: InternalSend;
};

export type Experience = ConsoleExperience | ContextExperience | ControlExperience | VisualExperience | DashboardExperience | QSearchExperience;

export type InternalExperience =
    | InternalConsoleExperience
    | InternalContextExperience
    | InternalControlExperience
    | InternalVisualExperience
    | InternalDashboardExperience
    | InternalQSearchExperience;

export type ContentOptions = VisualContentOptions | DashboardContentOptions | QSearchContentOptions | ConsoleContentOptions;

export interface BaseContentOptions {
    onMessage?: SimpleMessageEventHandler;
}

export type InternalSend = (messageEvent: TargetedMessageEvent) => void;
export type AddEventListener = (eventName: MessageEventName, listener: SimpleMessageEventHandler) => {remove: () => void};
export type ExperienceFrame = {
    internalAddEventListener: AddEventListener;
    internalSend: InternalSend;
    frame: EmbeddingIFrameElement;
};

export type ExperienceEventListener = {
    addExperienceEventListener: (listener: SimpleMessageEventHandler) => void;
    invokeExperienceEventListener: (data: TargetedMessageEvent) => void;
    removeExperienceEventListener: (listener: SimpleMessageEventHandler) => void;
};

export interface BaseExperience {
    experienceType: ExperienceType;
    discriminator?: number;
}

export type Send = (messageEvent: SimpleMessageEvent) => void;

export interface BaseFrame {
    send: Send;
    addEventListener: AddEventListener;
}
