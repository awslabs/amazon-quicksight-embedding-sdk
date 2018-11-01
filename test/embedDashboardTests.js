import embedDashboard from '../src/embedDashboard';

import {expect} from 'chai';
import mockGlobal from 'jsdom-global';

mockGlobal();

const mockUrl = 'a test url';
const mockContainer = document.createElement('div');
const mockOptions = {
    url: mockUrl,
    container:  mockContainer,
    width: '800px',
    height: '600px',
    parameters: {
        country: 'United States'
    }
};

describe('embedDashboard', function () {
    const dashboard = new embedDashboard(mockOptions);

    it ('should return dashboard object after embedding', () => {
        expect(dashboard).to.not.be.undefined;
    });

    it ('should attach iframe element to container', () => {
        const iFrame = dashboard.container.childNodes[0];

        expect(iFrame).to.not.be.undefined;
        expect(iFrame).to.be.an.instanceof(HTMLIFrameElement);
    });

    it ('should update url with encoded parameter values', () => {
        const iFrame = dashboard.container.childNodes[0];

        expect(iFrame.src).to.equal('a test url#p.country=United%20States');
    });

    it ('should set correct width and height for the iframe', () => {
        const iFrame = dashboard.container.childNodes[0];

        expect(iFrame.width).to.equal('800px');
        expect(iFrame.height).to.equal('600px');
    });
});