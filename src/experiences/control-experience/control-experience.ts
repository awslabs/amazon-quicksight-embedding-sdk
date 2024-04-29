// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {ControlExperienceFrame} from './frame/control-experience-frame';
import {ControlOptions, IControlExperience, InternalControlExperience, UrlInfo} from './types';
import {ExperienceType} from '../base-experience';
import {EventManager} from '@common/event-manager/event-manager';
import {ChangeEvent, TargetedMessageEvent} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {EventListener} from '@common/event-manager/types';
import {LogProvider} from '../../common';

export class ControlExperience {
    static FRAME_TIMEOUT = 60000;
    private readonly container: HTMLBodyElement;
    private readonly urlInfo: UrlInfo;
    private readonly internalExperience: InternalControlExperience;
    private readonly eventManager: EventManager;
    private readonly onChange?: EventListener;
    private readonly experience: IControlExperience = {
        experienceType: ExperienceType.CONTROL,
    };
    private readonly logger?: LogProvider;
    private readonly controlExperienceFrame: ControlExperienceFrame;

    constructor(
        container: HTMLBodyElement,
        controlOptions: ControlOptions,
        onChange?: EventListener,
        logger?: LogProvider
    ) {
        this.container = container;
        this.eventManager = controlOptions.eventManager;
        this.urlInfo = controlOptions.urlInfo;
        this.onChange = onChange;
        this.logger = logger;

        this.internalExperience = {
            ...this.experience,
            contextId: controlOptions.contextId,
            discriminator: 0,
        };

        const controlExperienceId = this.getControlExperienceId();

        this.controlExperienceFrame = new ControlExperienceFrame(
            {
                url: this.getControlExperienceBaseUrl(),
                container: this.container,
                width: '0px',
                height: '0px',
                onChange: this.onChange,
            },
            {
                eventManager: this.eventManager,
                contextId: this.internalExperience.contextId,
                timeout: ControlExperience.FRAME_TIMEOUT,
                urlInfo: this.urlInfo,
            },
            {},
            {},
            this.internalExperience,
            controlExperienceId
        );

        window.addEventListener('message', this.controlFrameMessageListener);
        this.eventManager.addEventListenerForCleanup(controlExperienceId, () =>
            window.removeEventListener('message', this.controlFrameMessageListener)
        );
    }

    public send = (messageEvent: TargetedMessageEvent) => {
        return this.controlExperienceFrame.send(messageEvent);
    };

    public controlFrameMessageListener = (event: MessageEvent<EmbeddingEvents>) => {
        if (this.isMessageEvent(event.data)) {
            const messageEvent = event.data;
            try {
                if (messageEvent.eventTarget) {
                    const incomingExperienceIdentifier = BaseExperience.getExperienceIdentifier(
                        messageEvent.eventTarget
                    );

                    this.eventManager.invokeEventListener(incomingExperienceIdentifier, messageEvent);
                }

                this.sendAcknowledgment(messageEvent);
            } catch (error) {
                this.onChange?.(
                    new ChangeEvent(
                        ChangeEventName.UNRECOGNIZED_EVENT_TARGET,
                        ChangeEventLevel.WARN,
                        'Message with unrecognized event target received',
                        {
                            eventTarget: messageEvent.eventTarget,
                        }
                    ),
                    {frame: this.controlExperienceFrame.iframe}
                );
                this.logger?.warn('Message with unrecognized event target received');
            }
        }
    };

    private sendAcknowledgment = (messageEvent: EmbeddingEvents) => {
        const acknowledgment = new TargetedMessageEvent(MessageEventName.ACKNOWLEDGE, this.internalExperience, {
            eventName: messageEvent.eventName,
            eventTarget: messageEvent.eventTarget,
        });

        window.requestIdleCallback?.(() => this.send(acknowledgment)) || this.send(acknowledgment);
    };

    private getControlExperienceId = () => {
        return [
            this.internalExperience.contextId,
            this.internalExperience.experienceType,
            this.internalExperience.discriminator,
        ]
            .filter(Boolean)
            .join('-');
    };

    private getControlExperienceBaseUrl = () => {
        const {host, sessionId} = this.urlInfo;
        const urlString = `${host}/embed/${sessionId}/embedControl`;
        return new URL(urlString).href;
    };

    private isMessageEvent = (messageEvent: EmbeddingEvents) => {
        return !!messageEvent && !!messageEvent.eventTarget && !!messageEvent.eventName;
    };
}
