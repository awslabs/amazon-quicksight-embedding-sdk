// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    ControlOptions,
    TargetedMessageEvent,
    ExperienceFrameMetadata,
    FrameOptions,
    QSearchContentOptions,
    QSearchFrame,
    ResponseMessage,
    SimpleMessageEvent,
    TransformedQSearchContentOptions,
    FrameStyles,
} from '../../types';
import {ChangeEventLevel, MessageEventName, ChangeEventName} from '../../enums';
import createExperienceFrame from '../createExperienceFrame';
import {extractQSearchExperienceFromUrl, getQSearchExperienceIdentifier} from '.';
import {buildInternalExperienceInfo} from '../commons';

const MAX_Z_INDEX = '2147483647';

const createQSearchFrame = (
    frameOptions: FrameOptions,
    contentOptions: QSearchContentOptions,
    controlOptions: ControlOptions,
    allExperienceIdentifiers: Set<string>
): QSearchFrame => {
    const {url, onChange} = frameOptions;
    const {contextId} = controlOptions || {};
    let frameStyles: FrameStyles;

    if (!url) {
        const message = 'Url is required for the experience';
        onChange?.({
            eventName: ChangeEventName.NO_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message,
        }, {frame: null});
        throw new Error(message);
    }

    const experienceFromUrl = extractQSearchExperienceFromUrl(url);
    if (!experienceFromUrl) {
        onChange?.({
            eventName: ChangeEventName.INVALID_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Invalid q search experience url',
            data: {
                url,
            },
        }, {frame: null});
        throw new Error('Invalid q search experience url');
    }
    const {experienceIdentifier, internalExperience} = buildInternalExperienceInfo(
        experienceFromUrl,
        allExperienceIdentifiers,
        contextId,
        getQSearchExperienceIdentifier
    );

    const interceptMessage = (
        messageEvent: SimpleMessageEvent,
        metadata: ExperienceFrameMetadata
    ) => {
        switch (messageEvent.eventName) {
            case MessageEventName.Q_SEARCH_OPENED:
            case MessageEventName.Q_SEARCH_CLOSED: {
                metadata.frame.style.height = `${messageEvent.message.height}px`;
                break;
            }
            case MessageEventName.CONTENT_LOADED: {
                window.addEventListener('click', event => {
                    !experienceFrame.frame.contains(event.target as Node) &&
                        _close();
                });
                break;
            }
            case MessageEventName.Q_SEARCH_ENTERED_FULLSCREEN: {
                frameStyles = {
                    position: metadata.frame.style.position,
                    top: metadata.frame.style.top,
                    left: metadata.frame.style.left,
                    zIndex: metadata.frame.style.zIndex,
                    width: metadata.frame.style.width,
                    height: metadata.frame.style.height,
                };
                metadata.frame.style.position = 'fixed';
                metadata.frame.style.top = '0px';
                metadata.frame.style.left = '0px';
                metadata.frame.style.zIndex = MAX_Z_INDEX;
                metadata.frame.style.width = '100vw';
                metadata.frame.style.height = '100vh';
                break;
            }
            case MessageEventName.Q_SEARCH_EXITED_FULLSCREEN: {
                metadata.frame.style.position = frameStyles.position;
                metadata.frame.style.top = frameStyles.top;
                metadata.frame.style.left = frameStyles.left;
                metadata.frame.style.zIndex = frameStyles.zIndex;
                metadata.frame.style.width = frameStyles.width;
                metadata.frame.style.height = frameStyles.height;
                break;
            }
        }
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    const transformContentOptions = (contentOptions: QSearchContentOptions): TransformedQSearchContentOptions => {
        const {
            hideIcon,
            hideTopicName,
            theme,
            allowTopicSelection,
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const unrecognizedContentOptionNames = Object.keys(unrecognizedContentOptions);
        if (Object.keys(unrecognizedContentOptions).length > 0) {
            onChange?.({
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: 'Q search content options contain unrecognized properties',
                data: {
                    unrecognizedContentOptions: unrecognizedContentOptionNames,
                },
            }, {frame: null});
            console.warn('Q search content options contain unrecognized properties');
        }

        const transformedContentOptions: TransformedQSearchContentOptions = {
            allowTopicSelection,
            onMessage,
        };

        if (hideIcon !== undefined) {
            transformedContentOptions.qBarIconDisabled = hideIcon;
        }

        if (hideTopicName !== undefined) {
            transformedContentOptions.qBarTopicNameDisabled = hideTopicName;
        }

        if (theme !== undefined) {
            transformedContentOptions.themeId = theme;
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


    const _setQuestion = async (question: string): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.SET_Q_SEARCH_QUESTION, 
            message: {
                question
            },
        });
    };

    const _close = (): Promise<ResponseMessage> => {
        return _send({
            eventName: MessageEventName.CLOSE_Q_SEARCH,
        });
    };

    return {
        setQuestion: _setQuestion,
        close: _close,
        send: _send,
        addEventListener: experienceFrame.internalAddEventListener,
    };
};

export default createQSearchFrame;
