//@flow
import type {VisualEmbeddingOptions} from './lib/types';
import eventify from './lib/eventify';
import constructEvent from './lib/constructEvent';
import {
    CLIENT_FACING_EVENT_NAMES,
    DASHBOARD_SIZE_OPTIONS,
    IN_COMING_POST_MESSAGE_EVENT_NAMES,
    OUT_GOING_POST_MESSAGE_EVENT_NAMES
} from './lib/constants';
import punycode from 'punycode';
/**
 * Embeddable visual object.
 * @name EmbeddableVisual
 * @param {VisualEmbeddingOptions} options - options set by customers to embed visual.
 */
class EmbeddableVisual {
    url: string;
    container: ?HTMLElement;
    parameters: ?Object;
    getActiveParametersCallback: ?Function;
    on: Function;
    off: Function;
    trigger: Function;
    iframe: HTMLIFrameElement;

    /* eslint-disable complexity */
    constructor(options: VisualEmbeddingOptions) {
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
            loadCallback,
            parametersChangeCallback
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

        if (typeof parametersChangeCallback === 'function') {
            this.on(CLIENT_FACING_EVENT_NAMES.parametersChange, parametersChangeCallback);
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
        (this: any).getUrl = this.getUrl.bind(this);
        (this: any).handleMessageEvent = this.handleMessageEvent.bind(this);
        (this: any).setParameters = this.setParameters.bind(this);
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

    handleMessageEvent(event: Object, options: VisualEmbeddingOptions): void {
        const {eventName, payload} = event.data;
        this.trigger(CLIENT_FACING_EVENT_NAMES[eventName], payload);
        if (eventName === IN_COMING_POST_MESSAGE_EVENT_NAMES.RESIZE_EVENT) {
            const {height} = options;
            if (height === DASHBOARD_SIZE_OPTIONS.AUTO_FIT) {
                this.iframe.height = payload.height;
            }
        }
    }

    setParameters(parameters: Object): void {
        const event = this.getParameterEvent(parameters);
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    getParameterEvent(parameters: Object): ?Object {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.UPDATE_PARAMETER_VALUES;
        const payload = {};
        const parameterNames = Object.keys(parameters);
        parameterNames.map(name => {
            const value = parameters[name];
            const values = [].concat(value);
            const encodedName = encodeURIComponent(name);
            payload[encodedName] = values.map(paramValue => encodeURIComponent(paramValue));
        });

        return constructEvent(eventName, {parameters: payload});
    }
}

function createIframe(options: VisualEmbeddingOptions): HTMLIFrameElement {
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
        fitToIframeWidth,
        footerPaddingEnabled,
    } = options;
    let src = url + '&punyCodeEmbedOrigin=' + punycode.encode(window.location.origin + '/');

    if (locale) {
        src = src + '&locale=' + locale;
    }
    
    if (footerPaddingEnabled) {
        src = src + '&footerPaddingEnabled=true';
    }

    if (fitToIframeWidth !== false) {
        src = src + '&fitToIframeWidth=true';

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

export default EmbeddableVisual;
