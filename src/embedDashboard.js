// @flow

import EmbeddableDashboard from './EmbeddableDashboard';
import type {EmbeddingOptions} from './lib/types';

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
    setTimeout(attachToDom.bind(null, url, container, width, height), 0);
    return dashboard;
}

/**
 * Create a iframe and attach it to parent element.
 * @function
 * @name attachToDom
 * @param {string} url - url of the dashboard to embed with parameter values appended.
 * @param {HTMLElement} container - parent html element.
 * @param {string} width - width of the iframe element.
 * @param {string} height - height of the iframe element.
 */
function attachToDom(url: string, container: ?HTMLElement, width: ?string, height: ?string) {
    const iframe = document.createElement('iframe');

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

export default embedDashboard;