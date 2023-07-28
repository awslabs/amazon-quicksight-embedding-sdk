// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    ControlOptions,
    TargetedMessageEvent,
    ExperienceFrameMetadata,
    FrameOptions,
    ResponseMessage,
    SimpleMessageEvent,
    TransformedVisualContentOptions,
    VisualContentOptions,
    VisualFrame,
    Parameter,
    ParametersAsObject,
    VisualAction,
} from '../../types';
import {ChangeEventLevel, MessageEventName, ChangeEventName} from '../../enums';
import createExperienceFrame from '../createExperienceFrame';
import {extractVisualExperienceFromUrl, getVisualExperienceIdentifier} from '.';
import {buildInternalExperienceInfo} from '../commons';

const createVisualFrame = (
    frameOptions: FrameOptions,
    contentOptions: VisualContentOptions,
    controlOptions: ControlOptions,
    allExperienceIdentifiers: Set<string>
): VisualFrame => {
    const {url, resizeHeightOnSizeChangedEvent, onChange} = frameOptions;
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

    const experienceFromUrl = extractVisualExperienceFromUrl(url);
    if (!experienceFromUrl) {
        onChange?.({
            eventName: ChangeEventName.INVALID_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Invalid visual experience url',
            data: {
                url,
            },
        }, {frame: null});
        throw new Error('Invalid visual experience url');
    }
    const {experienceIdentifier, internalExperience} = buildInternalExperienceInfo(
        experienceFromUrl,
        allExperienceIdentifiers,
        contextId,
        getVisualExperienceIdentifier
    );

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
    const transformContentOptions = (contentOptions: VisualContentOptions = {}): TransformedVisualContentOptions => {
        const {
            fitToIframeWidth,
            locale,
            parameters,
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const unrecognizedContentOptionNames = Object.keys(unrecognizedContentOptions);
        if (Object.keys(unrecognizedContentOptions).length > 0) {
            onChange?.({
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: 'Visual content options contain unrecognized properties',
                data: {
                    unrecognizedContentOptions: unrecognizedContentOptionNames,
                },
            }, {frame: null});
            console.warn('Visual content options contain unrecognized properties');
        }

        const transformedContentOptions: TransformedVisualContentOptions = {
            fitToIframeWidth: fitToIframeWidth ?? true,
            locale,
        };

        if (Array.isArray(parameters)) {
            transformedContentOptions.parameters = parameters.reduce((parametersAsObject: ParametersAsObject, parameter: Parameter) => {
                parametersAsObject[parameter.Name] = parameter.Values;
                return parametersAsObject;
            }, {});
        }

        return transformedContentOptions;
    };

    const experienceFrame = createExperienceFrame({
        frameOptions,
        contentOptions,
        transformedContentOptions: transformContentOptions(contentOptions),
        controlOptions,
        internalExperience,
        experienceIdentifier,
        interceptMessage
    });

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

    const _reset = async (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.RESET,
        });
    };

    const _getActions = async (): Promise<VisualAction[]> => {
        return _send({
            eventName: MessageEventName.GET_VISUAL_ACTIONS,
        });
    };

    const _addActions = async (actions: VisualAction[]): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.ADD_VISUAL_ACTIONS,
            message: {
                Actions: actions,
            },
        });
    };

    const _removeActions = async (actions: VisualAction[]): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.REMOVE_VISUAL_ACTIONS,
            message: {
                Actions: actions,
            },
        });
    };

    const _setActions = async (actions: VisualAction[]): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.SET_VISUAL_ACTIONS,
            message: {
                Actions: actions,
            },
        });
    };

    return {
        setParameters: _setParameters,
        reset: _reset,
        getActions: _getActions,
        addActions: _addActions,
        removeActions: _removeActions,
        setActions: _setActions,
        send: _send,
        addEventListener: experienceFrame.internalAddEventListener,
    };
};

export default createVisualFrame;
