// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import EmbeddableVisual from '../src/EmbeddableVisual';
import {expect} from 'chai';
import mockGlobal from 'jsdom-global';
import {
    DASHBOARD_SIZE_OPTIONS,
    IN_COMING_POST_MESSAGE_EVENT_NAMES,
    OUT_GOING_POST_MESSAGE_EVENT_NAMES,
} from '../src/lib/constants';

mockGlobal();
const mockUrl = 'https://quicksight.aws.amazon.com/embed/83f7dd46d1c84790a5ab09b21f229c91/dashboards/9933292e-0c96-40d9-b9c4-fe7bf0fee040?isauthcode=true&identityprovider=quicksight&code=AYABeNQwuPuQi_R9Hq95oY6eAj4AAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6ODQ1MzU0MDA0MzQ0OmtleS85ZjYzYzZlOS0xMzI3LTQxOGYtODhmZi1kM2Y3ODExMzI5MmIAuAECAQB4AmRZzSOhKpc9zj0wdhUN7llGI62VJKj5bKyNUrIBR3IBg0NXdMh6ofC7CV5nRfHYyAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHP0jB7y7937hydQqAIBEIA7HgUbbXBTWSpvsJMe3jAssYoqSjstrlCYBUBkUIxnw7UE5fV42Uz2h0lEcam_6_yhWHcrxxQpUfd6--ACAAAAAAwAABAAAAAAAAAAAAAAAAAAhUiNUsnZYGhc4QzC0C8k7v____8AAAABAAAAAAAAAAAAAAABAAAAm8NAUfwL7VmOmWq5qfvL9QPny6KtgT9DM_BO-q_jeTqAnt43tD_hydo4_bRjkSmvN0P1Q-uoDJyVGlj1RylkZae1tXPpsIYDZ2cQ3T2hGDp8kX6ZslLICCH3IuCMdyGViDrHXFIQMwVUV2Qr8qizpdcd-NZ8OkQtG6uaFp7KZF41LHa1uybEVJfc6l_C9sxuzEEr-XoJN6v-uL4qzjKz2VYuibp61w5Ro-kUpg%3D%3D';
const mockContainer = document.createElement('div');
const mockOptions = {
    url: mockUrl,
    container: mockContainer,
    width: '800px',
    height: '600px',
    fitToIframeWidth: true,
    scrolling: 'yes',
    parameters: {
        country: 'United States',
        state: ['California', 'Washington']
    },
    className: 'test-class',
    locale: 'test-locale',
    footerPaddingEnabled: true,
    trigger: mockFunction,
};
const mockAutoFitHeight = '1000px';

function mockFunction() {
}

describe('EmbeddableVisual', function() {
    let session;
    let iFrame;
    it('should construct basic object correctly', () => {
        session = new EmbeddableVisual(mockOptions);
        expect(session).to.not.equal(undefined);
        expect(session.url).to.equal(mockUrl);
        expect(session.container).to.equal(mockContainer);
    });

    it('should throw error if options is not given', () => {
        try {
            new EmbeddableVisual();
        } catch (e) {
            expect(e.message).to.equal('options is required');
        }
    });

    it('should throw error if url is not given', () => {
        try {
            new EmbeddableVisual({});
        } catch (e) {
            expect(e.message).to.equal('url is required');
        }
    });

    it('getUrl should return correct url', () => {
        const result = session.getUrl();
        expect(result).to.equal(mockUrl);
    });

    it('getContainer should return correct container', () => {
        const result = session.getContainer();
        expect(result).to.equal(mockContainer);
    });

    it('should update url with punycoded current url and encoded parameter values', () => {
        iFrame = session.iframe;

        expect(iFrame.src).to.equal(
            mockUrl +
            '&punyCodeEmbedOrigin=null/-' +
            '&locale=test-locale' +
            '&footerPaddingEnabled=true' +
            '&fitToIframeWidth=true' +
            '#p.country=United%20States&p.state=California&p.state=Washington'
        );
    });

    it('should set correct width and height for the iframe', () => {
        expect(iFrame.width).to.equal('800px');
        expect(iFrame.height).to.equal('600px');
    });

    it('should set correct scrolling attribute for the iframe', () => {
        expect(iFrame.scrolling).to.equal('yes');
    });

    it('should set correct class attribute for the iframe', () => {
        expect(iFrame.className).to.equal('quicksight-embedding-iframe test-class');
    });

    it('should set iFrame height to payload height if height parameter is set to AutoFit', () => {
        mockOptions.height = DASHBOARD_SIZE_OPTIONS.AUTO_FIT;
        session = new EmbeddableVisual(mockOptions);
        const event = {
            data: {
                payload: {
                    height: mockAutoFitHeight
                },
                eventName: IN_COMING_POST_MESSAGE_EVENT_NAMES.RESIZE_EVENT
            },
        };
        session.handleMessageEvent(event, mockOptions);
        expect(session.iframe.height).to.equal(mockAutoFitHeight);
    });

    it('should set correct parameters when invoked through setParameters function', () => {
        const parameters = {
            parameterOne: 'Value With Spaces & And',
            parameterTwo: ['MultiValueParameter', 'With special chars =']
        };
        const event = session.getParameterEvent(parameters);
        expect(event.eventName).to.equal(OUT_GOING_POST_MESSAGE_EVENT_NAMES.UPDATE_PARAMETER_VALUES);
        expect(event.payload.parameters.parameterOne[0]).to.equal('Value%20With%20Spaces%20%26%20And');
        expect(event.payload.parameters.parameterTwo[0]).to.equal('MultiValueParameter');
        expect(event.payload.parameters.parameterTwo[1]).to.equal('With%20special%20chars%20%3D');
    });
});
