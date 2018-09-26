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
    let dashboard;
    it ('should return dashboard object after embedding', () => {
        dashboard = new embedDashboard(mockOptions);
        expect(dashboard).to.not.equal(undefined);
    });

    it ('should attach iframe element to container', () => {
        expect(dashboard.container.childNodes[0] instanceof HTMLIFrameElement).to.equal(true);
    });

    it ('should update url with encoded parameter values', () => {
        expect(dashboard.container.childNodes[0].src).to.equal('a test url#p.country=United%20States');
    });

    it ('should set correct width and height for the iframe', () => {
        expect(dashboard.container.childNodes[0].width).to.equal('800px');
        expect(dashboard.container.childNodes[0].height).to.equal('600px');
    });
});