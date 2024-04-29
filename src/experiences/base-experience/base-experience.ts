// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    ContentOptions,
    Experiences,
    ExperienceType,
    FrameOptions,
    InternalExperiences,
    InternalExperienceInfo,
    TransformedContentOptions,
} from './types';
import {BaseExperienceFrame} from './frame/experience-frame';
import {ControlOptions} from '../control-experience';
import {ChangeEventLevel, ChangeEventName, EventMessageValues, MessageEventName} from '@common/events/types';
import {ChangeEvent, EmbeddingMessageEvent, ResponseMessage, TargetedMessageEvent} from '@common/events/events';
import {EventListener} from '@common/event-manager/types';
import {LogProvider} from '../../common';

export abstract class BaseExperience<
    ExperienceContentOptions extends ContentOptions,
    InternalExperience extends InternalExperiences,
    Experience extends Experiences,
    TransformedExperienceContentOptions extends TransformedContentOptions,
    ExperienceFrame extends BaseExperienceFrame<
        ExperienceContentOptions,
        TransformedExperienceContentOptions,
        InternalExperience
    >
> {
    protected abstract experience: Experience;
    protected abstract internalExperience: InternalExperience;
    protected abstract experienceId: string;
    protected abstract experienceFrame: ExperienceFrame;
    protected readonly frameOptions: FrameOptions;
    protected readonly contentOptions: ExperienceContentOptions;
    protected readonly controlOptions: ControlOptions;
    protected readonly experienceIdentifiers: Set<string>;
    protected logger?: LogProvider;

    protected constructor(
        frameOptions: FrameOptions,
        contentOptions: ExperienceContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        this.frameOptions = frameOptions;
        this.contentOptions = contentOptions;
        this.controlOptions = controlOptions;
        this.experienceIdentifiers = experienceIdentifiers;
        this.validateFrameOptions();
    }

    static getExperienceIdentifier = (experience: InternalExperiences): string => {
        if (experience.experienceType === ExperienceType.DASHBOARD) {
            const {contextId, experienceType, dashboardId, discriminator} = experience;
            return [contextId, experienceType, dashboardId, discriminator].filter(Boolean).join('-');
        }

        if (experience.experienceType === ExperienceType.VISUAL) {
            const {contextId, experienceType, dashboardId, sheetId, visualId, discriminator} = experience;
            return [contextId, experienceType, dashboardId, sheetId, visualId, discriminator].filter(Boolean).join('-');
        }

        if (
            [
                ExperienceType.CONSOLE,
                ExperienceType.CONTROL,
                ExperienceType.CONTEXT,
                ExperienceType.QSEARCH,
                ExperienceType.GENERATIVEQNA,
            ].includes(experience.experienceType)
        ) {
            const {contextId, experienceType, discriminator} = experience;
            return [contextId, experienceType, discriminator].filter(Boolean).join('-');
        }

        throw new Error('Invalid experience unable to build experience identifier');
    };

    public send = async <EventMessageValue extends EventMessageValues>(
        messageEvent: EmbeddingMessageEvent<MessageEventName>
    ): Promise<ResponseMessage<EventMessageValue>> => {
        if (!this.experienceFrame || !this.internalExperience) {
            throw new Error('Experience has not been initialized');
        }

        const targetedMessageEvent = new TargetedMessageEvent(
            messageEvent.eventName,
            this.internalExperience,
            messageEvent.message,
            messageEvent.data
        );

        return this.experienceFrame.send(targetedMessageEvent);
    };

    public addEventListener = (eventName: MessageEventName, listener: EventListener) => {
        return this.experienceFrame.addInternalEventListener(eventName, listener);
    };

    public setLogProvider = (logProvider: LogProvider) => {
        this.logger = logProvider;
        return this;
    };

    protected getInternalExperienceInfo = <
        EmbeddingInternalExperience extends InternalExperiences,
        EmbeddingExperience extends Experiences
    >(
        experience: EmbeddingExperience
    ): InternalExperienceInfo<EmbeddingInternalExperience> => {
        let discriminator = -1;
        let internalExperience: InternalExperiences;
        let experienceIdentifier: string;
        do {
            discriminator++;
            internalExperience = {
                ...experience,
                contextId: this.controlOptions.contextId,
                discriminator,
            };
            experienceIdentifier = BaseExperience.getExperienceIdentifier(internalExperience);
        } while (this.experienceIdentifiers.has(experienceIdentifier));

        this.experienceIdentifiers.add(experienceIdentifier);
        return {
            experienceIdentifier,
            internalExperience,
        } as InternalExperienceInfo<EmbeddingInternalExperience>;
    };

    protected transformContentOptions = <TCO extends TransformedContentOptions>(
        filteredOptions: TCO,
        unrecognizedContentOptions: object
    ): TCO => {
        this.warnUnrecognizedContentOptions(Object.keys(unrecognizedContentOptions));
        return filteredOptions;
    };

    protected warnUnrecognizedContentOptions = (unrecognizedProperties: string[]) => {
        if (unrecognizedProperties.length > 0) {
            this.frameOptions.onChange?.(
                new ChangeEvent(
                    ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                    ChangeEventLevel.WARN,
                    'Experience content options contain unrecognized properties',
                    {
                        unrecognizedContentOptions: unrecognizedProperties,
                    }
                ),
                {frame: null}
            );
            this.logger?.warn('Experience content options contain unrecognized properties');
        }
    };

    protected abstract extractExperienceFromUrl: (url: string) => Experience;

    private validateFrameOptions = () => {
        if (!this.frameOptions.url) {
            const message = 'Url is required for the experience';
            this.frameOptions.onChange?.(new ChangeEvent(ChangeEventName.NO_URL, ChangeEventLevel.ERROR, message), {
                frame: null,
            });
            throw new Error(message);
        }
    };
}
