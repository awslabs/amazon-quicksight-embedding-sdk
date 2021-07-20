// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import eventify from './lib/eventify';
import constructEvent from './lib/constructEvent';
import type {EmbeddingOptions} from './lib/types';
import {
    CLIENT_FACING_EVENT_NAMES,
    DASHBOARD_SIZE_OPTIONS,
    DEFAULT_EMBEDDING_VISUAL_TYPE_OPTIONS,
    IN_COMING_POST_MESSAGE_EVENT_NAMES,
    OUT_GOING_POST_MESSAGE_EVENT_NAMES,
} from './lib/constants';
import punycode from 'punycode';

/**
 * Embedding options.
 * @typedef {Object} EmbeddingOptions
 * @property {string} url - url of the session or dashboard to embed
 * @property {HTMLElement | string} container - parent html element or query selector string
 * @property {Function} errorCallback - callback when error occurs
 * @property {Function} loadCallback - callback when visualization data load complete
 * @property {Function} parametersChangeCallback - callback when parameters change occurs
 * @property {Function} getActiveParametersCallback - callback to get active parameter values
 * @property {Function} getSheetsCallback - callback to get sheet details
 * @property {Function} selectedSheetChangeCallback - callback when current sheet is changed
 * @property {Object} parameters
 * @property {string} width - width of the iframe
 * @property {string} height - height of the iframe
 * @property {string} loadingHeight - when height is set to be "AutoFit",
 *                                   loadingHeight is used before actual height is received
 * @property {string} scrolling
 * @property {string} locale
 */

/**
 * Embeddable Object class.
 * @class
 * @name EmbeddableObject
 * @param {EmbeddingOptions} options - options set by customers to embed the session or dashboard.
 */
class EmbeddableObject {
    url: string;
    container: ?HTMLElement;
    parameters: ?Object;
    defaultEmbeddingVisualType: ?string;
    getActiveParametersCallback: ?Function;
    getSheetsCallback: ?Function;
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
            defaultEmbeddingVisualType,
            errorCallback,
            loadCallback,
            parametersChangeCallback,
            selectedSheetChangeCallback
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
        this.defaultEmbeddingVisualType = defaultEmbeddingVisualType;

        this.iframe = createIframe(options);

        eventify(this);

        if (typeof errorCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.error, errorCallback);
        }

        if (typeof loadCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.load, loadCallback);
        }

        if (typeof parametersChangeCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.parametersChange, parametersChangeCallback);
        }

        if (typeof selectedSheetChangeCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.selectedSheetChange, selectedSheetChangeCallback);
        }

        window.addEventListener('message', (function(event) {
            if (!event) {
                return;
            }
            if (event.source === (this.iframe && this.iframe.contentWindow)) {
                this.handleMessageEvent(event, options);
            }
        }).bind(this), false);

        (this: any).getContainer = this.getContainer.bind(this);
        (this: any).getParameters = this.getParameters.bind(this);
        (this: any).getActiveParameterValues = this.getActiveParameterValues.bind(this);
        (this: any).getSheets = this.getSheets.bind(this);
        (this: any).getDefaultEmbeddingVisualType = this.getDefaultEmbeddingVisualType.bind(this);
        (this: any).getUrl = this.getUrl.bind(this);
        (this: any).handleMessageEvent = this.handleMessageEvent.bind(this);
        (this: any).setParameters = this.setParameters.bind(this);
        (this: any).setDefaultEmbeddingVisualType = this.setDefaultEmbeddingVisualType.bind(this);
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

    getActiveParameterValues(callback: Function) {
        if (typeof callback !== 'function') {
            return;
        }

        if (this.getActiveParametersCallback) {
            this.off(CLIENT_FACING_EVENT_NAMES.GET_ACTIVE_PARAMETER_VALUES, this.getActiveParametersCallback);
        }
        this.getActiveParametersCallback = callback;
        this.on(CLIENT_FACING_EVENT_NAMES.GET_ACTIVE_PARAMETER_VALUES, callback);
        const event = constructEvent(OUT_GOING_POST_MESSAGE_EVENT_NAMES.GET_ACTIVE_PARAMETER_VALUES, {});
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    getSheets(callback: Function) {
        if (typeof callback !== 'function') {
            return;
        }

        if (this.getSheetsCallback) {
            this.off(CLIENT_FACING_EVENT_NAMES.GET_SHEETS, this.getSheetsCallback);
        }
        this.getSheetsCallback = callback;
        this.on(CLIENT_FACING_EVENT_NAMES.GET_SHEETS, callback);
        const event = constructEvent(OUT_GOING_POST_MESSAGE_EVENT_NAMES.GET_SHEETS, {});
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    handleMessageEvent(event: Object, options: EmbeddingOptions): void {
        const {eventName, payload} = event.data;
        this.trigger(CLIENT_FACING_EVENT_NAMES[eventName], payload);
        if (eventName === IN_COMING_POST_MESSAGE_EVENT_NAMES.RESIZE_EVENT) {
            const {height} = options;
            if (height === DASHBOARD_SIZE_OPTIONS.AUTO_FIT) {
                this.iframe.height = payload.height;
            }
        }
    }

    getDefaultEmbeddingVisualType(): ?string {
        return this.defaultEmbeddingVisualType;
    }

    setParameters(parameters: Object): void {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.UPDATE_PARAMETER_VALUES;
        const payload = {parameters};
        const event = constructEvent(eventName, payload);
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    setDefaultEmbeddingVisualType(defaultEmbeddingVisualType: string): void {
        const event = this.generateDefaultEmbeddingVisualTypeEvent(defaultEmbeddingVisualType);
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    generateDefaultEmbeddingVisualTypeEvent(defaultEmbeddingVisualType: string): ?Object {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.DEFAULT_EMBEDDING_VISUAL_TYPE_OPTIONS;
        if (defaultEmbeddingVisualType == null ||
            !(defaultEmbeddingVisualType in DEFAULT_EMBEDDING_VISUAL_TYPE_OPTIONS)) {
            defaultEmbeddingVisualType = DEFAULT_EMBEDDING_VISUAL_TYPE_OPTIONS.AUTO_GRAPH;
        }

        const payload = {defaultEmbeddingVisualType};
        return constructEvent(eventName, payload);
    }
}

function createIframe(options: EmbeddingOptions): HTMLIFrameElement {
    let {width, height} = options;
    const {loadingHeight, url, scrolling, className} = options;
    if (height === DASHBOARD_SIZE_OPTIONS.AUTO_FIT) {
        height = loadingHeight;
    }
    const iframe = document.createElement('iframe');
    iframe.className = ['quicksight-embedding-iframe', className].join(' ').trim();
    iframe.width = width || '100%';
    iframe.height = height || '100%';
    iframe.scrolling = scrolling || 'no';
    iframe.onload = sendInitialPostMessage.bind(null, iframe, url);
    iframe.src = getIframeSrc(options);
    iframe.style.border = '0px';
    iframe.style.padding = '0px';
    return iframe;
}

function getIframeSrc(options): string {
    const {
        url,
        parameters,
        locale,
        footerPaddingEnabled,
        iframeResizeOnSheetChange,
        printEnabled,
        resetDisabled,
        sheetId,
        sheetTabsDisabled,
        undoRedoDisabled,
    } = options;
    let src = url + '&punyCodeEmbedOrigin=' + punycode.encode(window.location.origin + '/');

    src = src + '&printEnabled=' + String(!!printEnabled);

    if (locale) {
        src = src + '&locale=' + locale;
    }
    
    if (sheetTabsDisabled) {
        src = src + '&sheetTabsDisabled=' + String(sheetTabsDisabled);
    }

    if (sheetId) {
        src = src + '&sheetId=' + sheetId;
    }

    if (footerPaddingEnabled) {
        src = src + '&footerPaddingEnabled=' + String(footerPaddingEnabled);
    }

    if (undoRedoDisabled) {
        src = src + '&undoRedoDisabled=' + String(undoRedoDisabled);
    }

    if (resetDisabled) {
        src = src + '&resetDisabled=' + String(resetDisabled);
    }

    if (iframeResizeOnSheetChange) {
        src = src + '&resizeOnSheetChange=' + String(iframeResizeOnSheetChange);
    }

    if (parameters) {
        return useParameterValuesInUrl(src, parameters);
    }

    return src;
}

/**
 * Use parameter values in url.
 * @function
 * @name useParameterValuesInUrl
 * @param {string} url - url of the session or dashboard to embed.
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
        return;
    }

    const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.ESTABLISH_MESSAGE_CHANNEL;
    const event = constructEvent(eventName);
    // wait until iframe.contentWindow exists and send message to iframe window
    iframe.contentWindow.postMessage(event, domain);
}

export default EmbeddableObject;
