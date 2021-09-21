// @flow
// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import EmbeddableObject from './EmbeddableObject';
import EmbeddableDashboard from './EmbeddableDashboard';
import type {EmbeddingOptions} from './lib/types';

/**
 * Embed a dashboard.
 * @function
 * @name embedDashboard
 * @param {EmbeddingOptions} options - options set by customers to embed the dashboard.
 */
function embedDashboard(options: EmbeddingOptions): EmbeddableObject {
    const dashboard = new EmbeddableDashboard(options);
    return embedObject(dashboard);
}

/**
 * Embed a session.
 * @function
 * @name embedSession
 * @param {EmbeddingOptions} options - options set by customers to embed the session.
 */
function embedSession(options: EmbeddingOptions): EmbeddableObject {
    const embeddedSession = new EmbeddableObject(options);
    return embedObject(embeddedSession);
}

/**
 * Embed Q search bar.
 * @function
 * @name embedQSearchBar
 * @param {EmbeddingOptions} options - options set by customers to embed the Q search bar.
 */
function embedQSearchBar(options: EmbeddingOptions): EmbeddableObject {
    const embeddedQSearchBar = new EmbeddableObject({
        ...(options || {}),
        isQEmbedded: true
    });
    return embedObject(embeddedQSearchBar);
}

function embedObject(embeddableObject: EmbeddableObject) {
    const container = embeddableObject.getContainer();
    setTimeout(attachToDom.bind(null, embeddableObject.iframe, container), 0);
    return embeddableObject;
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


export {
    embedDashboard, embedSession, embedQSearchBar
};