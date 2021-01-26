//@flow
import constructEvent from './lib/constructEvent';
import EmbeddableObject from './EmbeddableObject';
import type {EmbeddingOptions} from './lib/types';
import {
    OUT_GOING_POST_MESSAGE_EVENT_NAMES,
} from './lib/constants';

/**
 * Embeddable dashboard object.
 * @name EmbeddableDashboard
 * @param {EmbeddingOptions} options - options set by customers to embed the session or dashboard.
 */
class EmbeddableDashboard extends EmbeddableObject {
    navigateToDashboard: Function;
    navigateToSheet: Function;
    initiatePrint: Function;

    constructor(options: EmbeddingOptions) {
        super(options);
    }

    /**
     * Navigates to new dashboard given options with dashboard Id.
     * Options must contain dashboard Id the user wants to navigate to.
     * @param {*} options 
     */
    navigateToDashboard(options: EmbeddingOptions): void {
        if (!options.dashboardId) {
            throw new Error('dashboardId is required');
        }
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.NAVIGATE_TO_DASHBOARD;
        const payload = options;
        const event = constructEvent(eventName, payload);
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    /**
     * Navigates to given sheet within dashboard
     * @param {String} sheetId
     */
    navigateToSheet(sheetId: String): void {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.NAVIGATE_TO_SHEET;
        const payload = {sheetId};
        const event = constructEvent(eventName, payload);
        this.iframe.contentWindow.postMessage(event, this.url);
    }

    initiatePrint() : void {
        const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.PRINT;
        const event = constructEvent(eventName, {});
        this.iframe.contentWindow.postMessage(event, this.url);
    }
}

export default EmbeddableDashboard;