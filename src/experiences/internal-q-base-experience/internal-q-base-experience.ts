// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
    BaseExperience,
    BaseExperienceFrame,
    ContentOptions,
    Experiences,
    InternalExperiences,
    TransformedContentOptions,
} from '../base-experience';
import {FrameStyles} from '../internal-q-base-experience';
import {EmbeddingMessageEvent, ResponseMessage} from '@common/events/events';
import {MessageEventName} from '@common/events/types';
import {ExperienceFrameMetadata} from '@common/embedding-context/types';

/**
 * Internal base experience for embedded Q,
 * containing shared functionality between q-search-bar and generative-qna experience types.
 */
export abstract class InternalQBaseExperience<
    ExperienceContentOptions extends ContentOptions,
    InternalExperience extends InternalExperiences,
    Experience extends Experiences,
    TransformedExperienceContentOptions extends TransformedContentOptions,
    ExperienceFrame extends BaseExperienceFrame<
        ExperienceContentOptions,
        TransformedExperienceContentOptions,
        InternalExperience
    >
> extends BaseExperience<
    ExperienceContentOptions,
    InternalExperience,
    Experience,
    TransformedExperienceContentOptions,
    ExperienceFrame
> {
    static readonly MAX_Z_INDEX = '2147483647';
    protected frameStyles?: FrameStyles;

    close = (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.CLOSE_Q_SEARCH));
    };

    setQuestion = (question: string): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_Q_SEARCH_QUESTION, {
                question,
            })
        );
    };

    protected trackOutsideClicks = (): void => {
        const clickHandler = async (event: MouseEvent) => {
            if (!this.experienceFrame.iframe?.contains(event.target as Node)) {
                try {
                    await this.close();
                } catch (e) {
                    if (!this.experienceFrame.iframe) {
                        // no-op. Edge case when iframe is deleted before response is returned
                        return;
                    }
                    throw e;
                }
            }
        };

        window.addEventListener('click', clickHandler);
        this.controlOptions.eventManager.addEventListenerForCleanup(this.experienceId, () =>
            window.removeEventListener('click', clickHandler)
        );
    };

    protected enterFullScreen = (metadata: ExperienceFrameMetadata | undefined): void => {
        if (!this.frameStyles && metadata?.frame) {
            this.frameStyles = {
                position: metadata.frame?.style.position,
                top: metadata.frame?.style.top,
                left: metadata.frame.style.left,
                zIndex: metadata.frame.style.zIndex,
                width: metadata.frame.style.width,
                height: metadata.frame.style.height,
            };

            metadata.frame.style.position = 'fixed';
            metadata.frame.style.top = '0px';
            metadata.frame.style.left = '0px';
            metadata.frame.style.zIndex = InternalQBaseExperience.MAX_Z_INDEX;
            metadata.frame.style.width = '100vw';
            metadata.frame.style.height = '100vh';
        }
    };

    protected exitFullScreen = (metadata: ExperienceFrameMetadata | undefined): void => {
        if (this.frameStyles && metadata?.frame) {
            metadata.frame.style.position = this.frameStyles.position;
            metadata.frame.style.top = this.frameStyles.top;
            metadata.frame.style.left = this.frameStyles.left;
            metadata.frame.style.zIndex = this.frameStyles.zIndex;
            metadata.frame.style.width = this.frameStyles.width;
            metadata.frame.style.height = this.frameStyles.height;
            this.frameStyles = undefined;
        }
    };
}
