// @flow
// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
    const container = dashboard.getContainer();
    setTimeout(attachToDom.bind(null, dashboard.iframe, container), 0);
    return dashboard;
}

/**
 * Create a iframe and attach it to parent element.
 * @function
 * @name attachToDom
 * @param {HTMLIFrameElement} iframe
 * @param {string} url - url of the dashboard to embed with parameter values appended.
 * @param {HTMLElement} container - parent html element.
 */
function attachToDom(iframe: ?HTMLIFrameElement, container: ?HTMLElement) {
    if (!iframe) {
        throw new Error('iFrame is required');
    }

    if (!container) {
        throw new Error('container of iFrame is required');
    }

    container.appendChild(iframe);
}


export default embedDashboard;