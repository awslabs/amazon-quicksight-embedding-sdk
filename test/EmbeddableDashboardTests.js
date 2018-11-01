// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import EmbeddableDashboard from '../src/EmbeddableDashboard';
import {expect} from 'chai';
import mockGlobal from 'jsdom-global';

mockGlobal();

const mockUrl = 'a test url';
const mockContainer = document.createElement('div');
const mockOptions = {
    url: mockUrl,
    container:  mockContainer,
    width: '800px',
    height: '600px'
};

describe('EmbeddableDashboard', function() {
    let dashboard;
    it ('should construct basic object correctly', () => {
        dashboard = new EmbeddableDashboard(mockOptions);
        expect(dashboard).to.not.equal(undefined);
        expect(dashboard.url).to.equal(mockUrl);
        expect(dashboard.container).to.equal(mockContainer);
    });

    it ('should throw error if options is not given', () => {
        try {
            new EmbeddableDashboard();
        } catch (e) {
            expect(e.message).to.equal('options is required');
        }
    });

    it ('should throw error if url is not given', () => {
        try {
            new EmbeddableDashboard({});
        } catch (e) {
            expect(e.message).to.equal('url is required');
        }
    });

    it ('getUrl should return correct url', () => {
        const result = dashboard.getUrl();
        expect(result).to.equal(mockUrl);
    });

    it ('getContainer should return correct container', () => {
        const result = dashboard.getContainer();
        expect(result).to.equal(mockContainer);
    });

    it ('getSize should return correct size object', () => {
        const result = dashboard.getSize();
        expect(result).to.deep.equal({width: '800px', height: '600px'});
    });
});