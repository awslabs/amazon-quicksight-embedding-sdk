// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {v4} from 'uuid';
import {buildExperienceUrl, FRAME_TIMEOUT, SDK_VERSION} from '../commons';
import createIframe from '../commons/createIframe';
import {ChangeEventLevel, MessageEventName, ChangeEventName} from '../enums';
import {
    BuildExperienceUrlOptions,
    ContentOptions,
    ControlOptions,
    TargetedMessageEvent,
    SimpleMessageEventHandler,
    ExperienceFrame,
    FrameOptions,
    InterceptMessage,
    InternalExperience,
    PostMessageEvent,
    ExperienceFrameMetadata,
    EmbeddingIFrameElement,
    SimpleMessageEvent,
    SimpleChangeEvent,
} from '../types';

const MESSAGE_RESPONSE_TIMEOUT = 5000;

const createExperienceFrame = (
    frameOptions: FrameOptions,
    contentOptions: ContentOptions,
    controlOptions: ControlOptions,
    internalExperience: InternalExperience,
    experienceIdentifier: string,
    interceptMessage?: InterceptMessage
): ExperienceFrame => {
    const {url, container, width = '100%', height = '100%', withIframePlaceholder, className, onChange} = frameOptions;

    let experienceIframe: EmbeddingIFrameElement | null = null;

    // Decorate change event listener with experience frame's metadata
    const _onChange = (changeEvent: SimpleChangeEvent) => {
        if (typeof onChange !== 'function') {
            return;
        }
        const metadata: ExperienceFrameMetadata = {
            frame: experienceIframe,
        };
        onChange(changeEvent, metadata);
    };

    // Make sure container is provided

    if (!container) {
        const message = 'Container is required for the experience';
        _onChange({
            eventName: ChangeEventName.NO_CONTAINER,
            eventLevel: ChangeEventLevel.ERROR,
            message,
            data: {
                experience: internalExperience,
            },
        });
        throw new Error(message);
    }

    let _container: HTMLElement;
    if (typeof container === 'string') {
        try {
            _container = document.querySelector(container);
        } catch (error) {
            const {message} = error as Error;
            _onChange({
                eventName: ChangeEventName.INVALID_CONTAINER,
                eventLevel: ChangeEventLevel.ERROR,
                message,
                data: {
                    experience: internalExperience,
                },
            });
            throw error;
        }
    } else if (typeof container === 'object' && container.nodeName) {
        _container = container;
    }

    if (!_container) {
        const message = `Invalid container '${container}' for the experience`;
        _onChange({
            eventName: ChangeEventName.INVALID_CONTAINER,
            eventLevel: ChangeEventLevel.ERROR,
            message,
            data: {
                experience: internalExperience,
            },
        });
        throw new Error(message);
    }

    const {eventManager, sendToControlFrame, timeout = FRAME_TIMEOUT} = controlOptions;

    const {onMessage, ...contentOptionsWithoutOnMessage} = contentOptions || {};

    const {experienceEventListenerBuilder} = eventManager;

    // Decorate message event listener with experience frame's metadata
    const _onMessage = (messageEvent: SimpleMessageEvent) => {
        const metadata: ExperienceFrameMetadata = {
            frame: experienceIframe,
        };
        // Intercepting onMessage
        interceptMessage && interceptMessage(messageEvent, metadata);
        onMessage?.(messageEvent, metadata);
    };

    const {addExperienceEventListener, removeExperienceEventListener} = experienceEventListenerBuilder(experienceIdentifier, _onMessage);

    let _url: string;

    // Make sure url is provided

    if (url) {
        _url = buildExperienceUrl(url, contentOptionsWithoutOnMessage as BuildExperienceUrlOptions, internalExperience);
    } else {
        _onChange({
            eventName: ChangeEventName.NO_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Url is required for the experience',
            data: {
                experience: internalExperience,
            },
        });
        throw new Error('Url is required for the experience');
    }

    // Start creating the frame

    const sendToOwnFrame = async (messageEvent: TargetedMessageEvent) => {
        const eventId = v4();
        const _message: PostMessageEvent = {
            ...messageEvent,
            eventId,
            timestamp: Date.now(),
            version: SDK_VERSION,
        };

        experienceIframe.contentWindow.postMessage(_message, _url);

        if (messageEvent.eventName === MessageEventName.ACKNOWLEDGE) {
            return Promise.resolve({
                success: true,
            });
        }

        return new Promise((resolve, reject) => {
            const eventHandler = (event: MessageEvent) => {
                const responseMessageEvent = event.data;
                if (responseMessageEvent.eventId === eventId) {
                    window.removeEventListener('message', eventHandler);
                    resolve(event.data.message);
                }
            };
            window.addEventListener('message', eventHandler);
            setTimeout(() => {
                window.removeEventListener('message', eventHandler);
                reject();
            }, MESSAGE_RESPONSE_TIMEOUT);
        });
    };

    const internalSend = async (messageEvent: TargetedMessageEvent) => {
        const sendMethod = sendToControlFrame || sendToOwnFrame;
        return sendMethod(messageEvent);
    };

    let timeoutInstance: NodeJS.Timeout;

    timeoutInstance = setTimeout(() => {
        _onChange({
            eventName: ChangeEventName.FRAME_NOT_CREATED,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Creating the frame timed out',
            data: {
                experience: internalExperience,
            },
        });
        throw new Error('Creating the frame timed out');
    }, timeout);

    const onLoadHandler = async () => {
        if (timeoutInstance) {
            clearTimeout(timeoutInstance);
        }
        _onChange({
            eventName: ChangeEventName.FRAME_LOADED,
            eventLevel: ChangeEventLevel.INFO,
            message: 'The frame loaded',
            data: {
                experience: internalExperience,
            },
        });
    };

    // Create the iframe

    _onChange({
        eventName: ChangeEventName.FRAME_STARTED,
        eventLevel: ChangeEventLevel.INFO,
        message: 'Creating the frame',
        data: {
            experience: internalExperience,
        },
    });

    try {
        experienceIframe = createIframe({
            id: experienceIdentifier,
            src: _url,
            width,
            height,
            container: _container,
            onLoad: onLoadHandler,
            withIframePlaceholder,
            className,
        });
    } catch (error) {
        _onChange({
            eventName: ChangeEventName.FRAME_NOT_CREATED,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Failed to create the frame',
            data: {
                experience: internalExperience,
            },
        });
        throw error;
    }

    _onChange({
        eventName: ChangeEventName.FRAME_MOUNTED,
        eventLevel: ChangeEventLevel.INFO,
        message: 'The frame mounted',
        data: {
            frame: experienceIframe,
            experience: internalExperience,
        },
    });

    const internalAddEventListener = (eventName: MessageEventName, listener: SimpleMessageEventHandler) => {
        const handler = (messageEvent: SimpleMessageEvent, metadata: ExperienceFrameMetadata) => {
            if (messageEvent.eventName === eventName) {
                listener(messageEvent, metadata);
            }
        };
        addExperienceEventListener(handler);
        return {
            remove: () => {
                removeExperienceEventListener(handler);
            },
        };
    };

    const self: ExperienceFrame = {
        internalAddEventListener,
        internalSend,
        frame: experienceIframe,
    };

    return self;
};

export default createExperienceFrame;
