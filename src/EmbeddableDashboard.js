// @flow

import eventify from './lib/eventify';
import type {EmbeddingOptions} from './lib/types';

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

        const width = options.width ||
            (this.container && this.container.offsetWidth ? this.container.offsetWidth + 'px' : undefined);
        const height = options.height ||
            (this.container && this.container.offsetWidth ? this.container.offsetWidth + 'px' : undefined);

        this.size = {width, height};

        eventify(this);

        if (typeof errorCallback === 'function') {
            this.on('error', errorCallback);
        }

        if (typeof loadCallback === 'function') {
            this.on('load', loadCallback);
        }
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

    setParameters(): void {
        throw new Error('setParameters Not implemented');
    }
}

export default EmbeddableDashboard;