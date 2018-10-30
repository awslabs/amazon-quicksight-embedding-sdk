// @flow

import EmbeddableDashboard from './EmbeddableDashboard';
import type {EmbeddingOptions} from './lib/types';
import {OUT_GOING_POST_MESSAGE_EVENT_NAMES} from './lib/constants';
import constructEvent from './lib/constructEvent';

/**
 * Embed a dashboard.
 * @function
 * @name embedDashboard
 * @param {EmbeddingOptions} options - options set by customers to embed the dashboard.
 */
function embedDashboard(options: EmbeddingOptions): EmbeddableDashboard {
    const dashboard = new EmbeddableDashboard(options);
    const parameters = dashboard.getParameters();
    const url = parameters ? useParameterValuesInUrl(dashboard.getUrl(), parameters) : dashboard.getUrl();
    const container = dashboard.getContainer();
    const size = dashboard.getSize();
    let width, height;
    if (size) {
        width = size.width;
        height = size.height;
    }
    const iframe = document.createElement('iframe');
    dashboard.iframe = iframe;
    setTimeout(attachToDom.bind(null, iframe, url, container, width, height), 0);
    return dashboard;
}

/**
 * Create a iframe and attach it to parent element.
 * @function
 * @name attachToDom
 * @param {HTMLIFrameElement} iframe
 * @param {string} url - url of the dashboard to embed with parameter values appended.
 * @param {HTMLElement} container - parent html element.
 * @param {string} width - width of the iframe element.
 * @param {string} height - height of the iframe element.
 */
function attachToDom(
    iframe: ?HTMLIFrameElement,
    url: string,
    container: ?HTMLElement,
    width: ?string,
    height: ?string
) {
    iframe.onload = sendInitialPostMessage.bind(null, iframe, url);

    iframe.src = url;

    if (width) {
        iframe.width = width;
    }

    if (height) {
        iframe.height = height;
    }

    if (!container) {
        throw new Error('can\'t find container');
    }

    container.appendChild(iframe);
}

/**
 * Use parameter values in url.
 * @function
 * @name useParameterValuesInUrl
 * @param {string} url - url of the dashboard to embed.
 * @param {Object} parameters
 */
function useParameterValuesInUrl(url: string, parameters: Object) {
    const parameterNames = Object.keys(parameters);
    const parameterStrings = parameterNames.map(name => {
        const encodedName = encodeURIComponent(name);
        const encodedValue = encodeURIComponent(parameters[name]);
        return `p.${encodedName}=${encodedValue}`;
    });

    return `${url}#${parameterStrings.join('&')}`;
}

function sendInitialPostMessage(iframe, domain) {
    if (iframe.contentWindow === null) {
        setTimeout(sendInitialPostMessage.bind(null, iframe, domain), 100);
    }

    const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.ESTABLISH_MESSAGE_CHANNEL;
    const event = constructEvent(eventName);
    // wait until iframe.contentWindow exists and send message to iframe window
    iframe.contentWindow.postMessage(event, domain);
}


export default embedDashboard;