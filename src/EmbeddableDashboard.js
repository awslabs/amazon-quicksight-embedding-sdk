// @flow
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import eventify from './lib/eventify';
import constructEvent from './lib/constructEvent';
import type {EmbeddingOptions} from './lib/types';
import {
    IN_COMING_POST_MESSAGE_EVENT_NAMES,
    OUT_GOING_POST_MESSAGE_EVENT_NAMES,
    CLIENT_FACING_EVENT_NAMES,
    DASHBOARD_SIZE_OPTIONS
} from './lib/constants';
import punycode from 'punycode';

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
 * @property {string} loadingHeight - when height is set to be "AutoFit",
 *                                   loadingHeight is used before actual height is received
 * @property {string} scrolling
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

        this.iframe = createIframe(options);

        eventify(this);

        if (typeof errorCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.error, errorCallback);
        }

        if (typeof loadCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.load, loadCallback);
        }

        window.addEventListener('message', (function(event) {
            if (!event) {
                return;
            }
            if (event.source === (this.iframe && this.iframe.contentWindow)) {
                const {eventName, payload} = event.data;
                this.trigger(CLIENT_FACING_EVENT_NAMES[eventName], payload);
                if (eventName === IN_COMING_POST_MESSAGE_EVENT_NAMES.RESIZE_EVENT) {
                    const {height} = options;
                    if (height === DASHBOARD_SIZE_OPTIONS.AUTO_FIT) {
                        this.iframe.height = payload.height;
                    }
                }
            }
        }).bind(this), false);

        (this:any).getContainer = this.getContainer.bind(this);
        (this:any).getParameters = this.getParameters.bind(this);
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

    setParameters(parameters: Object): void {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.UPDATE_PARAMETER_VALUES;
        const payload = {parameters};
        const event = constructEvent(eventName, payload);
        this.iframe.contentWindow.postMessage(event, this.url);
    }
}

function createIframe(options: EmbeddingOptions): HTMLIFrameElement {
    let {width, height} = options;
    const {loadingHeight, url, scrolling} = options;
    if (height === DASHBOARD_SIZE_OPTIONS.AUTO_FIT) {
        height = loadingHeight;
    }
    const iframe = document.createElement('iframe');
    iframe.className = 'quicksight-embedding-iframe';
    iframe.width = width || '100%';
    iframe.height = height || '100%';
    iframe.scrolling = scrolling || 'no';
    iframe.onload = sendInitialPostMessage.bind(null, iframe, url);
    iframe.src = getIframeSrc(options);
    return iframe;
}

function getIframeSrc(options): string {
    const {url, parameters} = options;
    let src = url + '&punyCodeEmbedOrigin=' + punycode.encode(window.location.origin + '/');
    if (parameters) {
        return useParameterValuesInUrl(src, parameters);
    }
    return src;
}

/**
 * Use parameter values in url.
 * @function
 * @name useParameterValuesInUrl
 * @param {string} url - url of the dashboard to embed.
 * @param {Object} parameters
 */
function useParameterValuesInUrl(url: string, parameters: Object): string {
    const parameterNames = Object.keys(parameters);
    const parameterStrings = parameterNames.map(name => {
        const value = parameters[name];
        const values = [].concat(value);
        const encodedName = encodeURIComponent(name);
        return values.map(paramValue => encodeURIComponent(paramValue))
            .map(encodedValue => `p.${encodedName}=${encodedValue}`)
            .join('&');
    });

    return `${url}#${parameterStrings.join('&')}`;
}

function sendInitialPostMessage(iframe: HTMLIFrameElement, domain: string): void {
    if (iframe.contentWindow === null) {
        setTimeout(sendInitialPostMessage.bind(null, iframe, domain), 100);
    }

    const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.ESTABLISH_MESSAGE_CHANNEL;
    const event = constructEvent(eventName);
    // wait until iframe.contentWindow exists and send message to iframe window
    iframe.contentWindow.postMessage(event, domain);
}

export default EmbeddableDashboard;