import EmbeddableDashboard from '../src/EmbeddableDashboard';
import constructEvent from '../src/lib/constructEvent';
import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import {
    OUT_GOING_POST_MESSAGE_EVENT_NAMES,
} from '../src/lib/constants';
import {
    createSandbox,
    spy
} from 'sinon';
import mockGlobal from 'jsdom-global';

mockGlobal();
const mockUrl = 'https://quicksight.aws.amazon.com/embed/83f7dd46d1c84790a5ab09b21f229c91/dashboards/9933292e-0c96-40d9-b9c4-fe7bf0fee040?isauthcode=true&identityprovider=quicksight&code=AYABeNQwuPuQi_R9Hq95oY6eAj4AAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6ODQ1MzU0MDA0MzQ0OmtleS85ZjYzYzZlOS0xMzI3LTQxOGYtODhmZi1kM2Y3ODExMzI5MmIAuAECAQB4AmRZzSOhKpc9zj0wdhUN7llGI62VJKj5bKyNUrIBR3IBg0NXdMh6ofC7CV5nRfHYyAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHP0jB7y7937hydQqAIBEIA7HgUbbXBTWSpvsJMe3jAssYoqSjstrlCYBUBkUIxnw7UE5fV42Uz2h0lEcam_6_yhWHcrxxQpUfd6--ACAAAAAAwAABAAAAAAAAAAAAAAAAAAhUiNUsnZYGhc4QzC0C8k7v____8AAAABAAAAAAAAAAAAAAABAAAAm8NAUfwL7VmOmWq5qfvL9QPny6KtgT9DM_BO-q_jeTqAnt43tD_hydo4_bRjkSmvN0P1Q-uoDJyVGlj1RylkZae1tXPpsIYDZ2cQ3T2hGDp8kX6ZslLICCH3IuCMdyGViDrHXFIQMwVUV2Qr8qizpdcd-NZ8OkQtG6uaFp7KZF41LHa1uybEVJfc6l_C9sxuzEEr-XoJN6v-uL4qzjKz2VYuibp61w5Ro-kUpg%3D%3D';
const mockContainer = document.createElement('div');
const mockOptions = {
    url: mockUrl,
    container: mockContainer,
    width: '800px',
    height: '600px',
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

function mockFunction() {
}

describe('EmbeddableDashboard', () => {
    let session;
    let sandbox = createSandbox();
    it('should construct basic object correctly', () => {
        session = new EmbeddableDashboard(mockOptions);        
        expect(session).to.not.equal(undefined);
        expect(session.url).to.equal(mockUrl);
        expect(session.container).to.equal(mockContainer);
    });

    describe('navigate to dashboard', () => {
        const dashboardId = '37a99f75-8230-4409-ac52-e45c652cc21e';
        it('should call postMessage with correct arguments', () => {       
            const {window} = new JSDOM();
            
            const postMessageSpy = spy(window.postMessage);
            sandbox.stub(session.iframe, 'contentWindow').value(window);

            const eventName = OUT_GOING_POST_MESSAGE_EVENT_NAMES.NAVIGATE_TO_DASHBOARD;
            const options = {dashboardId};
            const event = constructEvent(eventName, options);

            session.navigateToDashboard(options);
            postMessageSpy.calledWith(event, mockUrl);
        });
    
        it('should throw error when trying to navigate to dashboard without dashboardId', () => {
            try {
                session.navigateToDashboard({});        
            } catch (e) {
                expect(e.message).to.equal('dashboardId is required');
            }
        });
    });
});