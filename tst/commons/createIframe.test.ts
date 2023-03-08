import {CreateIframeOptions} from '../../src/types';
import createIframe from '../../src/commons/createIframe';

describe('createIframe', () => {
    const TEST_ID = 'testId';
    const TEST_URL = 'https://test.amazon.com';
    const TEST_WIDTH = '800px';
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const DEFAULT_OPTIONS: CreateIframeOptions = {
        id: TEST_ID,
        src: TEST_URL,
        container: TEST_CONTAINER,
    };

    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    beforeEach(() => {
        createElementSpy = jest.spyOn(document, 'createElement');
        appendChildSpy = jest.spyOn(TEST_CONTAINER, 'appendChild');
    });

    afterEach(() => {
        createElementSpy.mockRestore();
        appendChildSpy.mockRestore();
    });

    it('should create iframe', () => {
        const iframe = createIframe(DEFAULT_OPTIONS);
        expect(createElementSpy).not.toHaveBeenCalledWith('div');
        expect(createElementSpy).toHaveBeenCalledWith('iframe');
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        expect(iframe.width).toEqual('0px');
        expect(iframe.height).toEqual('0px');
    });

    it('should create iframe placeholder', () => {
        const options = {
            ...DEFAULT_OPTIONS,
            withIframePlaceholder: true,
        };
        const iframe = createIframe(options);
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(createElementSpy).toHaveBeenCalledWith('iframe');
        expect(appendChildSpy).toHaveBeenCalledTimes(2);
        expect(iframe.width).toEqual('0px');
        expect(iframe.height).toEqual('0px');
    });

    it('should create iframe with desired width', () => {
        const options = {
            ...DEFAULT_OPTIONS,
            width: TEST_WIDTH,
        };
        const iframe = createIframe(options);
        expect(iframe.width).toEqual(TEST_WIDTH);
        expect(iframe.height).toEqual('0px');
    });
});
