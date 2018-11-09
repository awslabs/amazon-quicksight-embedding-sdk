// @flow
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import eventify from './lib/eventify';
import constructEvent from './lib/constructEvent';
import type {EmbeddingOptions} from './lib/types';
import {IN_GOING_POST_MESSAGE_EVENT_NAMES, OUT_GOING_POST_MESSAGE_EVENT_NAMES} from './lib/constants';

/**
 * Embedding options.
 * @typedef {Object} EmbeddingOptions
 * @property {string} url - url of the dashboard to embed
 * @property {HTMLElement | string} container - parent html element or query selector string
 * @property {Function} errorCallback - callback when error occurs
 * @property {Function} loadCallback - callback when visualization data load complete
 * @property {Object} parameters
 * @property {string} width - width of the iframe
 * @property {string} height - height of the iframe
 */

/**
 * Embeddable dashboard class.
 * @class
 * @name EmbeddableDashboard
 * @param {EmbeddingOptions} options - options set by customers to embed the dashboard.
 */
class EmbeddableDashboard {
    url: string;
    container: ?HTMLElement;
    parameters: ?Object;
    size: ?Object;
    on: Function;
    off: Function;
    trigger: Function;
    iframe: HTMLIFrameElement;

    /* eslint-disable complexity */
    constructor(options: EmbeddingOptions) {
        if (!options) {
            throw new Error('options is required');
        }

        if (!options.url) {
            throw new Error('url is required');
        }

        const {
            url,
            container,
            parameters,
            errorCallback,
            loadCallback
        } = options;

        this.url = url;

        if (container instanceof HTMLElement) {
            this.container = container;
        } else if (typeof container === 'string') {
            this.container = document.querySelector(container);
        }

        if (!this.container) {
            throw new Error('can\'t find valid container');
        }

        this.parameters = parameters;

        const width = options.width || '100%';
        const height = options.height || '100%';

        this.size = {width, height};

        eventify(this);

        if (typeof errorCallback === 'function') {
            this.on(IN_GOING_POST_MESSAGE_EVENT_NAMES.ERROR, errorCallback);
        }

        if (typeof loadCallback === 'function') {
            this.on(IN_GOING_POST_MESSAGE_EVENT_NAMES.LOAD, loadCallback);
        }

        window.addEventListener('message', (function(event) {
            if (event.source === (this.iframe && this.iframe.contentWindow)) {
                this.trigger(event.data.eventName, event.data.payload);
            }
        }).bind(this), false);

        (this:any).getContainer = this.getContainer.bind(this);
        (this:any).getParameters = this.getParameters.bind(this);
        (this:any).getSize = this.getSize.bind(this);
        (this:any).getUrl = this.getUrl.bind(this);
        (this:any).setParameters = this.setParameters.bind(this);
    }

    getUrl(): string {
        return this.url;
    }

    getContainer(): ?HTMLElement {
        return this.container;
    }

    getParameters(): ?Object {
        return this.parameters;
    }

    getSize(): ?Object {
        return this.size;
    }

    setParameters(parameters: Object): void {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.UPDATE_PARAMETER_VALUES;
        const payload = {parameters};
        const event = constructEvent(eventName, payload);
        this.iframe.contentWindow.postMessage(event, this.url);
    }
}

export default EmbeddableDashboard;