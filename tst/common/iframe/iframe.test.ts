import {IframeOptions} from '@common/iframe/types';
import {Iframe} from '@common/iframe/iframe';

describe('IFrame', () => {
    const TEST_ID = 'testId';
    const TEST_URL = 'https://test.amazon.com';
    const TEST_WIDTH = '800px';
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const DEFAULT_OPTIONS: IframeOptions = {
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
        const iframe = new Iframe(DEFAULT_OPTIONS);
        expect(createElementSpy).not.toHaveBeenCalledWith('div');
        expect(createElementSpy).toHaveBeenCalledWith('iframe');
        expect(appendChildSpy).toHaveBeenCalledTimes(1);
        expect(iframe.getIframe().width).toEqual('0px');
        expect(iframe.getIframe().height).toEqual('0px');
    });

    it('should create iframe placeholder and trigger remove when load event is fired', () => {
        const options: IframeOptions = {
            ...DEFAULT_OPTIONS,
            withIframePlaceholder: true,
            loading: 'lazy',
            height: '500',
        };
        const iframe = new Iframe(options);
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(createElementSpy).toHaveBeenCalledWith('iframe');
        expect(appendChildSpy).toHaveBeenCalledTimes(2);
        expect(iframe.getIframe().width).toEqual('0px');
        expect(iframe.getIframe().height).toEqual('500');
        expect(iframe.getIframe().style.opacity).toEqual('0');

        const placeholder = TEST_CONTAINER.querySelector('div');

        const removeSpy = jest.spyOn(placeholder!, 'remove');

        iframe.getIframe().dispatchEvent(new Event('load'));

        expect(placeholder?.style.height).toEqual('');

        expect(removeSpy).toBeCalled();

        expect(iframe.getIframe().style.opacity).toEqual('1');

        expect(iframe.getIframe().loading).toEqual('lazy');
    });

    it('should create iframe placeholder with correct styling applied', () => {
        const options = {
            ...DEFAULT_OPTIONS,
            withIframePlaceholder: true,
            id: 'test',
            height: '500px',
        };
        const iframe = new Iframe(options);
        expect(createElementSpy).toHaveBeenCalledWith('div');
        expect(createElementSpy).toHaveBeenCalledWith('iframe');
        expect(appendChildSpy).toHaveBeenCalledTimes(2);
        expect(iframe.getIframe().width).toEqual('0px');
        expect(iframe.getIframe().height).toEqual('500px');

        const placeholder = TEST_CONTAINER.querySelector('div');

        expect(placeholder?.style.height).toEqual('500px');
        expect(placeholder?.style.position).toEqual('');
    });

    it('should create iframe with desired width', () => {
        const options = {
            ...DEFAULT_OPTIONS,
            width: TEST_WIDTH,
        };

        const iframe = new Iframe(options);
        expect(iframe.getIframe().width).toEqual(TEST_WIDTH);
        expect(iframe.getIframe().height).toEqual('0px');
    });

    it('should create iframe with user defined classname', () => {
        const className = 'My-Class-Name';
        const options: IframeOptions = {
            ...DEFAULT_OPTIONS,
            className,
        };

        const iframe = new Iframe(options);
        expect(iframe.getIframe().className).toContain(className);
    });

    it('should create iframe placeholder with user defined element', () => {
        const placeholderEl = window.document.createElement('span');
        placeholderEl.id = 'custom-el';

        const options: IframeOptions = {
            ...DEFAULT_OPTIONS,
            withIframePlaceholder: placeholderEl,
        };

        new Iframe(options);

        expect(TEST_CONTAINER?.querySelector('[id="custom-el"]')?.textContent).toBeDefined();
    });

    it('should create iframe using postRequest', () => {
        const payload = {
            auth: '1234',
        };

        const formSubmitSpy = jest.fn();

        window.HTMLFormElement.prototype.submit = formSubmitSpy;

        const iframe = new Iframe({
            ...DEFAULT_OPTIONS,
            payload,
        });

        expect(appendChildSpy).toHaveBeenCalledTimes(2);

        const formEl = TEST_CONTAINER.querySelector('form');

        jest.spyOn(formEl!, 'remove');

        expect(formEl?.getAttribute('action')).toEqual(DEFAULT_OPTIONS.src);
        expect(formEl?.getAttribute('method')).toEqual('POST');
        expect(formEl?.getAttribute('target')).toEqual(DEFAULT_OPTIONS.id);
        expect(formEl?.style.visibility).toEqual('hidden');

        const inputEl = formEl?.querySelector('input');

        expect(inputEl?.getAttribute('value')).toEqual(payload.auth);
        expect(inputEl?.getAttribute('name')).toEqual(Object.keys(payload)[0]);

        expect(formSubmitSpy).toBeCalled();
        formSubmitSpy.mockRestore();

        iframe.getIframe().dispatchEvent(new Event('load'));

        expect(formEl?.remove).toBeCalledTimes(1);
    });

    it('Should throw error if source is missing for post request', () => {
        expect(() => {
            new Iframe(
                // @ts-expect-error - should throw error when source is missing
                {
                    payload: {},
                    id: '1234',
                    container: TEST_CONTAINER,
                }
            );
        }).toThrow('No source has been provided.');
    });
});
