// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    ControlOptions,
    DashboardContentOptions,
    DashboardFrame,
    TargetedMessageEvent,
    ExperienceFrameMetadata,
    ExportToolbarOption,
    FrameOptions,
    NavigateToDashboardOptions,
    ResponseMessage,
    SimpleMessageEvent,
    TransformedDashboardContentOptions,
    Sheet,
    Parameter,
    ParametersAsObject,
} from '../../types';
import {ChangeEventLevel, MessageEventName, ChangeEventName} from '../../enums';
import createExperienceFrame from '../createExperienceFrame';
import {extractDashboardExperienceFromUrl, getDashboardExperienceIdentifier} from '.';
import {buildInternalExperienceInfo} from '../commons';

const createDashboardFrame = (
    frameOptions: FrameOptions,
    contentOptions: DashboardContentOptions,
    controlOptions: ControlOptions,
    allExperienceIdentifiers: Set<string>
): DashboardFrame => {
    const {url, onChange} = frameOptions;
    const {contextId} = controlOptions || {};

    if (!url) {
        const message = 'Url is required for the experience';
        onChange?.({
            eventName: ChangeEventName.NO_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message,
        }, {frame: null});
        throw new Error(message);
    }

    const experienceFromUrl = extractDashboardExperienceFromUrl(url);
    if (!experienceFromUrl) {
        onChange?.({
            eventName: ChangeEventName.INVALID_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Invalid dashboard experience url',
            data: {
                url,
            },
        }, {frame: null});
        throw new Error('Invalid dashboard experience url');
    }
    const {experienceIdentifier, internalExperience} = buildInternalExperienceInfo(
        experienceFromUrl,
        allExperienceIdentifiers,
        contextId,
        getDashboardExperienceIdentifier
    );

    const {resizeHeightOnSizeChangedEvent} = frameOptions;

    const interceptMessage = (messageEvent: SimpleMessageEvent, metadata: ExperienceFrameMetadata) => {
        // Intercepting onMessage
        // if the resizeHeightOnSizeChangedEvent is true, upon receiving SIZE_CHANGED message, update the height of the iframe
        if (messageEvent.eventName === 'SIZE_CHANGED' && resizeHeightOnSizeChangedEvent) {
            metadata.frame.height = `${messageEvent.message.height}px`;
        }
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    const transformContentOptions = (contentOptions: DashboardContentOptions = {}): TransformedDashboardContentOptions => {
        const {
            parameters,
            locale,
            attributionOptions,
            sheetOptions,
            toolbarOptions,
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const unrecognizedContentOptionNames = Object.keys(unrecognizedContentOptions);
        if (unrecognizedContentOptionNames.length > 0) {
            const warnMessage = 'Dashboard content options contain unrecognized properties';
            onChange?.({
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: warnMessage,
                data: {
                    unrecognizedContentOptions: unrecognizedContentOptionNames,
                },
            }, {frame: null});
            console.warn(warnMessage);
        }

        const transformedContentOptions: TransformedDashboardContentOptions = {
            locale,
            onMessage,
        };

        if (Array.isArray(parameters)) {
            transformedContentOptions.parameters = parameters.reduce((parametersAsObject: ParametersAsObject, parameter: Parameter) => {
                parametersAsObject[parameter.Name] = parameter.Values;
                return parametersAsObject;
            }, {});
        }
        
        if (attributionOptions?.overlayContent !== true) {
            transformedContentOptions.footerPaddingEnabled = true;
        }

        if (toolbarOptions?.export === true || (toolbarOptions?.export as ExportToolbarOption)?.print === true) {
            transformedContentOptions.printEnabled = true;
        }
        if (toolbarOptions?.undoRedo !== true) {
            transformedContentOptions.undoRedoDisabled = true;
        }
        if (toolbarOptions?.reset !== true) {
            transformedContentOptions.resetDisabled = true;
        }
        if (toolbarOptions?.bookmarks === true) {
            transformedContentOptions.showBookmarksIcon = true;
        }

        if (sheetOptions?.initialSheetId) {
            transformedContentOptions.sheetId = sheetOptions.initialSheetId;
        }
        if (typeof sheetOptions?.singleSheet === 'boolean') {
            transformedContentOptions.sheetTabsDisabled = sheetOptions.singleSheet;
        }
        if (sheetOptions?.emitSizeChangedEventOnSheetChange === true) {
            transformedContentOptions.resizeOnSheetChange = true;
        }

        return transformedContentOptions;
    };

    const experienceFrame = createExperienceFrame(
        frameOptions,
        transformContentOptions(contentOptions),
        controlOptions,
        internalExperience,
        experienceIdentifier,
        interceptMessage
    );

    const _send = async (messageEvent: SimpleMessageEvent): Promise<any> => {
        const targetedMessageEvent: TargetedMessageEvent = {
            ...messageEvent,
            eventTarget: internalExperience,
        };
        const messageResponse = await experienceFrame.internalSend(targetedMessageEvent);
        return messageResponse;
    };

    const _setParameters = async (parameters: Parameter[]): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.SET_PARAMETERS,
            message: parameters,
        });
    };

    const _initiatePrint = async (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.INITIATE_PRINT,
        });
    };

    const _undo = async (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.UNDO,
        });
    };

    const _redo = async (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.REDO,
        });
    };

    const _toggleBookmarksPane = async (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.TOGGLE_BOOKMARKS_PANE,
        });
    };

    const _reset = async (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.RESET,
        });
    };

    const _getParameters = async (): Promise<Parameter[]> => {
        return _send({
            eventName: MessageEventName.GET_PARAMETERS,
        });
    };

    const _getSheets = async (): Promise<Sheet[]> => {
        return _send({
            eventName: MessageEventName.GET_SHEETS,
        });
    };

    const _getSelectedSheetId = async (): Promise<string> => {
        return _send({
            eventName: MessageEventName.GET_SELECTED_SHEET_ID,
        });
    };

    const _navigateToDashboard = async (dashboardId: string, navigateToDashboardOptions?: NavigateToDashboardOptions): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.NAVIGATE_TO_DASHBOARD,
            message: {
                DashboardId: dashboardId,
                Parameters: navigateToDashboardOptions?.parameters,
            }
        });
    };

    const _setSelectedSheetId = async (sheetId: string): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.SET_SELECTED_SHEET_ID,
            message: {
                SheetId: sheetId,
            },
        });
    };

    return {
        getParameters: _getParameters,
        getSheets: _getSheets,
        getSelectedSheetId: _getSelectedSheetId,
        initiatePrint: _initiatePrint,
        navigateToDashboard: _navigateToDashboard,
        setSelectedSheetId: _setSelectedSheetId,
        setParameters: _setParameters,
        undo: _undo,
        redo: _redo,
        reset: _reset,
        toggleBookmarksPane: _toggleBookmarksPane,
        send: _send,
        addEventListener: experienceFrame.internalAddEventListener,
    };
};

export default createDashboardFrame;
