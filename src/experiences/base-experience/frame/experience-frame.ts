// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {v4} from 'uuid';
import {encode} from 'punycode';
import {ContentOptions, FrameOptions, InternalExperiences, TransformedContentOptions} from '../types';
import {ParametersAsObject} from '../../../common';
import {ControlOptions} from '@experience/control-experience/types';
import {ExperienceFrameMetadata} from '@common/embedding-context/types';
import {EmbeddingIFrameElement} from '@common/iframe/types';
import {EventListener} from '@common/event-manager/types';
import {
    ChangeEventLevel,
    ChangeEventName,
    EmbeddingEvents,
    EventMessageValues,
    MessageEventName,
} from '@common/events/types';
import {
    ChangeEvent,
    DataResponse,
    ErrorResponse,
    PostMessageEvent,
    SuccessResponse,
    TargetedMessageEvent,
} from '@common/events/events';
import {Iframe} from '@common/iframe/iframe';

export const SDK_VERSION = '2.9.0';

export abstract class BaseExperienceFrame<
    ExperienceContentOptions extends ContentOptions,
    TransformedExperienceContentOptions extends TransformedContentOptions,
    InternalExperience extends InternalExperiences
> {
    protected readonly frameOptions: FrameOptions;
    protected readonly contentOptions: ExperienceContentOptions;
    protected readonly controlOptions: ControlOptions;
    protected readonly transformedContentOptions: TransformedExperienceContentOptions;
    protected readonly experienceId: string;
    protected readonly internalExperience: InternalExperience;
    protected readonly onChange: EventListener;
    protected url: string;
    private readonly MESSAGE_RESPONSE_TIMEOUT = 5000;

    public iframe: EmbeddingIFrameElement | null = null;
    public container: HTMLElement;
    public onMessage: EventListener;
    public timeoutInstance?: NodeJS.Timeout;

    protected constructor(
        frameOptions: FrameOptions,
        controlOptions: ControlOptions,
        contentOptions: ExperienceContentOptions,
        transformedContentOptions: TransformedExperienceContentOptions,
        internalExperience: InternalExperience,
        experienceIdentifier: string,
        interceptMessage?: EventListener
    ) {
        this.frameOptions = frameOptions;
        this.contentOptions = contentOptions;
        this.onChange = this.decorateOnChange(frameOptions.onChange);
        this.onMessage = this.decorateOnMessage(contentOptions.onMessage, interceptMessage);
        this.container = this.getContainer(frameOptions.container);
        this.internalExperience = internalExperience;
        this.controlOptions = controlOptions;
        this.transformedContentOptions = transformedContentOptions;
        this.experienceId = experienceIdentifier;
        this.url = this.validateBaseUrl(frameOptions.url);

        this.controlOptions.eventManager.addEventListener(this.experienceId, this.onMessage, true);
        this.initializeMutationObserver();
    }

    public send = async <EventMessageValue extends EventMessageValues = EventMessageValues>(
        messageEvent: TargetedMessageEvent
    ): Promise<SuccessResponse | ErrorResponse<EventMessageValue> | DataResponse<EventMessageValue>> => {
        if (this.controlOptions.sendToControlFrame) {
            return this.controlOptions.sendToControlFrame(messageEvent);
        }

        if (!this.iframe) {
            throw new Error(`Cannot send ${messageEvent.eventName}: No experience frame found`);
        }

        const eventId = v4();
        const message = new PostMessageEvent(
            messageEvent.eventName,
            messageEvent.eventTarget,
            eventId,
            Date.now(),
            SDK_VERSION,
            messageEvent.message,
            messageEvent.data
        );

        this.iframe?.contentWindow?.postMessage(message, this.url);

        if (messageEvent.eventName === MessageEventName.ACKNOWLEDGE) {
            return Promise.resolve(new SuccessResponse());
        }

        return new Promise((resolve, reject) => {
            const eventHandler = (
                event: MessageEvent<
                    PostMessageEvent<
                        MessageEventName,
                        | {success: false; errorCode: string; errors?: string}
                        | {
                              success: true;
                          }
                    >
                >
            ) => {
                const responseMessageEvent = event.data;
                if (responseMessageEvent?.eventId === eventId) {
                    window.removeEventListener('message', eventHandler);

                    if (responseMessageEvent.message?.success === true) {
                        resolve(new SuccessResponse());
                    } else if (responseMessageEvent.message?.success === false) {
                        resolve(new ErrorResponse(responseMessageEvent.message));
                    } else {
                        resolve(new DataResponse(responseMessageEvent.message));
                    }
                }
            };

            window.addEventListener('message', eventHandler);
            setTimeout(() => {
                window.removeEventListener('message', eventHandler);
                reject(`${messageEvent.eventName} timed out`);
            }, this.MESSAGE_RESPONSE_TIMEOUT);
        });
    };

    public buildParameterString = (parameters?: ParametersAsObject) => {
        if (!parameters || typeof parameters !== 'object') {
            return '';
        }

        return Object.entries(parameters)
            .map(([key, value]) => {
                const values = Array.isArray(value) ? value : [value];

                const encodedName = encodeURIComponent(key);

                return values
                    .map(encodeURIComponent)
                    .map(encodedValue => `p.${encodedName}=${encodedValue}`)
                    .join('&');
            })
            .join('&');
    };

    public buildQueryString = (
        options: Omit<TransformedExperienceContentOptions, 'onMessage' | 'parameters'> &
            Pick<InternalExperience, 'contextId' | 'discriminator'>
    ) => {
        const filteredOptions = Object.entries(options).reduce(
            (memoizedOptions, [key, value]) => {
                if (value !== undefined && value !== null) {
                    return {
                        ...memoizedOptions,
                        [key]: `${value}`,
                    };
                }
                return memoizedOptions;
            },
            {
                punyCodeEmbedOrigin: encode(`${window.location.origin}/`),
                sdkVersion: SDK_VERSION,
            }
        );

        return new URLSearchParams(filteredOptions).toString();
    };

    public createExperienceIframe = () => {
        this.onChange(
            new ChangeEvent(ChangeEventName.FRAME_STARTED, ChangeEventLevel.INFO, 'Creating the frame', {
                experience: this.internalExperience,
            })
        );

        try {
            this.setTimeoutInstance();
            this.iframe = new Iframe({
                id: this.experienceId,
                src: this.url,
                width: this.frameOptions.width,
                height: this.frameOptions.height,
                container: this.container,
                onLoad: this.onLoadHandler,
                withIframePlaceholder: this.frameOptions.withIframePlaceholder,
                className: this.frameOptions.className,
            }).getIframe();
        } catch (err) {
            this.onChange(
                new ChangeEvent(
                    ChangeEventName.FRAME_NOT_CREATED,
                    ChangeEventLevel.ERROR,
                    'Failed to create the frame',
                    {
                        experience: this.internalExperience,
                    }
                )
            );

            throw err;
        }

        this.onChange(
            new ChangeEvent(ChangeEventName.FRAME_MOUNTED, ChangeEventLevel.INFO, 'The frame mounted', {
                experience: this.internalExperience,
                frame: this.iframe,
            })
        );
    };

    public addInternalEventListener = (eventName: MessageEventName, listener: EventListener) => {
        const handler = (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
            if (messageEvent.eventName === eventName) {
                listener(messageEvent, metadata);
            }
        };

        this.controlOptions.eventManager.addEventListener(this.experienceId, handler, true);

        return {
            remove: () => this.controlOptions.eventManager.removeEventListener(this.experienceId, handler),
        };
    };

    private validateBaseUrl = (url: string) => {
        if (!url) {
            this.onChange(
                new ChangeEvent(ChangeEventName.NO_URL, ChangeEventLevel.ERROR, 'Url is required for the experience', {
                    experience: this.internalExperience,
                })
            );

            throw new Error('Url is required for the experience');
        }

        return url;
    };

    private setTimeoutInstance = () => {
        this.timeoutInstance = setTimeout(() => {
            this.onChange(
                new ChangeEvent(
                    ChangeEventName.FRAME_NOT_CREATED,
                    ChangeEventLevel.ERROR,
                    'Creating the frame timed out',
                    {
                        experience: this.internalExperience,
                    }
                )
            );
            throw new Error('Creating the frame timed out');
        }, this.controlOptions.timeout);
    };

    private onLoadHandler = async () => {
        if (this.timeoutInstance) {
            clearTimeout(this.timeoutInstance);
        }

        this.onChange(
            new ChangeEvent(ChangeEventName.FRAME_LOADED, ChangeEventLevel.INFO, 'The experience iframe loaded', {
                experience: this.internalExperience,
            })
        );
    };

    private getContainer = (container: HTMLElement | string) => {
        if (!container) {
            const message = 'Container is required for the experience';
            this.onChange(
                new ChangeEvent(ChangeEventName.NO_CONTAINER, ChangeEventLevel.ERROR, message, {
                    experience: this.internalExperience,
                })
            );

            throw new Error(message);
        }

        let _container: HTMLElement | null = null;

        if (typeof container === 'string') {
            try {
                _container = document.querySelector(container);
            } catch (error) {
                if (error instanceof Error) {
                    this.onChange(
                        new ChangeEvent(ChangeEventName.INVALID_CONTAINER, ChangeEventLevel.ERROR, error.message, {
                            experience: this.internalExperience,
                        })
                    );
                }

                throw error;
            }
        } else if (typeof container === 'object' && container.nodeName) {
            _container = container;
        }

        if (!_container) {
            const message = `Invalid container '${container}' for the experience`;
            this.onChange(
                new ChangeEvent(ChangeEventName.INVALID_CONTAINER, ChangeEventLevel.ERROR, message, {
                    experience: this.internalExperience,
                })
            );

            throw new Error(message);
        }

        return _container;
    };

    private decorateOnChange = (onChange?: EventListener) => {
        return (changeEvent: EmbeddingEvents) => {
            if (onChange) {
                const metadata: ExperienceFrameMetadata = {
                    frame: this.iframe,
                };
                onChange(changeEvent, metadata);
            }
        };
    };

    private decorateOnMessage = (onMessage?: EventListener, interceptOnMessage?: EventListener) => {
        return (messageEvent: EmbeddingEvents) => {
            if (interceptOnMessage && this.iframe) {
                interceptOnMessage(messageEvent, {
                    frame: this.iframe,
                });
            }

            if (onMessage) {
                onMessage(messageEvent, {
                    frame: this.iframe,
                });
            }
        };
    };

    // Add mutation observer to perform cleaning up tasks after container or frame is removed from the dom
    private initializeMutationObserver = () => {
        const mutationObserver = new MutationObserver(mutations => {
            const isRemoved = mutations.some(record =>
                Array.from(record.removedNodes).some(node => node === this.iframe || node === this.container)
            );

            if (isRemoved) {
                this.controlOptions.eventManager.cleanUpCallbacksForExperience(this.experienceId);
                mutationObserver.disconnect();
                this.iframe = null;

                this.onChange(
                    new ChangeEvent(
                        ChangeEventName.FRAME_REMOVED,
                        ChangeEventLevel.INFO,
                        'Frame removed from the DOM',
                        {
                            experience: this.internalExperience,
                        }
                    )
                );
            }
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    protected abstract buildExperienceUrl: (baseUrl: string) => string;
}
