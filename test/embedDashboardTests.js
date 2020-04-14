// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import embedDashboard from '../src/embedDashboard';

import {expect} from 'chai';
import mockGlobal from 'jsdom-global';

mockGlobal();

const mockUrl = 'https://quicksight.aws.amazon.com/embed/83f7dd46d1c84790a5ab09b21f229c91/dashboards/9933292e-0c96-40d9-b9c4-fe7bf0fee040?isauthcode=true&identityprovider=quicksight&code=AYABeNQwuPuQi_R9Hq95oY6eAj4AAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6ODQ1MzU0MDA0MzQ0OmtleS85ZjYzYzZlOS0xMzI3LTQxOGYtODhmZi1kM2Y3ODExMzI5MmIAuAECAQB4AmRZzSOhKpc9zj0wdhUN7llGI62VJKj5bKyNUrIBR3IBg0NXdMh6ofC7CV5nRfHYyAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHP0jB7y7937hydQqAIBEIA7HgUbbXBTWSpvsJMe3jAssYoqSjstrlCYBUBkUIxnw7UE5fV42Uz2h0lEcam_6_yhWHcrxxQpUfd6--ACAAAAAAwAABAAAAAAAAAAAAAAAAAAhUiNUsnZYGhc4QzC0C8k7v____8AAAABAAAAAAAAAAAAAAABAAAAm8NAUfwL7VmOmWq5qfvL9QPny6KtgT9DM_BO-q_jeTqAnt43tD_hydo4_bRjkSmvN0P1Q-uoDJyVGlj1RylkZae1tXPpsIYDZ2cQ3T2hGDp8kX6ZslLICCH3IuCMdyGViDrHXFIQMwVUV2Qr8qizpdcd-NZ8OkQtG6uaFp7KZF41LHa1uybEVJfc6l_C9sxuzEEr-XoJN6v-uL4qzjKz2VYuibp61w5Ro-kUpg%3D%3D';
const mockContainer = document.createElement('div');
const mockOptions = {
    url: mockUrl,
    container:  mockContainer,
    width: '400px',
    height: 'AutoFit',
    loadingHeight: '200px'
};

describe('embedDashboard', function() {
    const dashboard = new embedDashboard(mockOptions);
    let iFrame;

    it ('should return dashboard object after embedding', () => {
        expect(dashboard).to.not.be.undefined;
    });

    it ('should attach iframe element to container', () => {
        iFrame = dashboard.container.childNodes[0];
        expect(iFrame).to.not.be.undefined;
        expect(iFrame).to.be.an.instanceof(HTMLIFrameElement);
    });

    it ('when set as AutoFit, should use loadingHeight before actual dashboard height is known', () => {
        expect(iFrame.width).to.be.equals('400px');
        expect(iFrame.height).to.be.equals('200px');
    });
});