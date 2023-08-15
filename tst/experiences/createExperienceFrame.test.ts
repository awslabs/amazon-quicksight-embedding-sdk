import {expect, jest, it} from '@jest/globals';

import eventManagerBuilder from '../../src/eventManager';
import {ChangeEventLevel, ExperienceType, ChangeEventName} from '../../src/enums';
import {
    EventManager,
    InternalControlExperience
} from '../../src/types';
import createIframe from '../../src/commons/createIframe';
import createExperienceFrame from '../../src/experiences/createExperienceFrame';

jest.mock('../../src/commons/createIframe');

const createIframeMock = jest.mocked(createIframe, true);

describe('createExperienceFrame', () => {
    const TEST_URL = 'https://test.amazon.com/embed/guid/dashboards/dashboardId';
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_INTERNAL_EXPERIENCE: InternalControlExperience = {
        experienceType: ExperienceType.CONTROL,
        contextId: TEST_CONTEXT_ID,
        discriminator: 1,
    };
    const TEST_WIDTH = '80%';
    const TEST_HEIGHT = '600px';
    const TEST_EXPERIENCE_IDENTIFIER = 'testExperienceIdentifier';
    const eventManager: EventManager = eventManagerBuilder();

    const onChangeSpy = jest.fn();

    const TEST_CONTROL_OPTIONS = {
        eventManager,
        contextId: TEST_CONTEXT_ID,
    };

    beforeEach(() => {
        jest.spyOn(eventManager, 'experienceEventListenerBuilder').mockImplementation(() => ({
            addExperienceEventListener: jest.fn(),
            removeExperienceEventListener: jest.fn(),
            invokeExperienceEventListener: jest.fn(),
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create experience frame', () => {
        const frameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const transformedContentOptions = {
            //
        };
        const experienceFrame = createExperienceFrame({
            frameOptions,
            contentOptions,
            transformedContentOptions,
            controlOptions: TEST_CONTROL_OPTIONS,
            internalExperience: TEST_INTERNAL_EXPERIENCE,
            experienceIdentifier: TEST_EXPERIENCE_IDENTIFIER,
        });
        expect(createIframeMock).toHaveBeenCalled();
        const createFrameArguments = createIframeMock.mock.calls[0][0];
        expect(createFrameArguments.src.startsWith(TEST_URL)).toBe(true);
        expect(createFrameArguments.container).toEqual(TEST_CONTAINER);
        expect(createFrameArguments.width).toEqual('100%');
        expect(createFrameArguments.height).toEqual('100%');
        expect(typeof experienceFrame.internalSend).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.FRAME_STARTED,
            eventLevel: ChangeEventLevel.INFO,
            message: 'Creating the frame',
            data: {
                experience: TEST_INTERNAL_EXPERIENCE,
            },
        }, {frame: null});
    });

    it('should create experience frame with fixed width and height', () => {
        const frameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: TEST_WIDTH,
            height: TEST_HEIGHT,
        };
        const contentOptions = {
            //
        };
        const transformedContentOptions = {
            //
        };
        const experienceFrame = createExperienceFrame({
            frameOptions,
            contentOptions,
            transformedContentOptions,
            controlOptions: TEST_CONTROL_OPTIONS,
            internalExperience: TEST_INTERNAL_EXPERIENCE,
            experienceIdentifier: TEST_EXPERIENCE_IDENTIFIER,
        });
        expect(createIframeMock).toHaveBeenCalled();
        const createFrameArguments = createIframeMock.mock.calls[0][0];
        expect(createFrameArguments.src.startsWith(TEST_URL)).toBe(true);
        expect(createFrameArguments.container).toEqual(TEST_CONTAINER);
        expect(createFrameArguments.width).toEqual(TEST_WIDTH);
        expect(createFrameArguments.height).toEqual(TEST_HEIGHT);
        expect(typeof experienceFrame.internalSend).toEqual('function');
    });

    it('should create experience frame with auto fit height', () => {
        const frameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: TEST_WIDTH,
            height: TEST_HEIGHT,
            resizeHeightOnSizeChangedEvent: true,
        };
        const contentOptions = {
            //
        };
        const transformedContentOptions = {
            //
        };
        const experienceFrame = createExperienceFrame({
            frameOptions,
            contentOptions,
            transformedContentOptions,
            controlOptions: TEST_CONTROL_OPTIONS,
            internalExperience: TEST_INTERNAL_EXPERIENCE,
            experienceIdentifier: TEST_EXPERIENCE_IDENTIFIER,
        });
        expect(createIframeMock).toHaveBeenCalled();
        const createFrameArguments = createIframeMock.mock.calls[0][0];
        expect(createFrameArguments.src.startsWith(TEST_URL)).toBe(true);
        expect(createFrameArguments.container).toEqual(TEST_CONTAINER);
        expect(createFrameArguments.width).toEqual(TEST_WIDTH);
        expect(createFrameArguments.height).toEqual(TEST_HEIGHT);
        expect(typeof experienceFrame.internalSend).toEqual('function');
    });

    it('should not create experience frame without container', () => {
        const frameOptions = {
            url: TEST_URL,
            // @ts-expect-error - should throw error if frame options does not have a container
            container: undefined,
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const transformedContentOptions = {
            //
        };
        const experienceFrame = () => {
            createExperienceFrame({
                frameOptions,
                contentOptions,
                transformedContentOptions,
                controlOptions: TEST_CONTROL_OPTIONS,
                internalExperience: TEST_INTERNAL_EXPERIENCE,
                experienceIdentifier: TEST_EXPERIENCE_IDENTIFIER,
            });
        };
        expect(experienceFrame).toThrowError();
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.NO_CONTAINER,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Container is required for the experience',
            data: {
                experience: TEST_INTERNAL_EXPERIENCE,
            },
        }, {frame: null});
        expect(createIframeMock).not.toHaveBeenCalled();
    });

    it('should not create experience frame with invalid container', () => {
        const TEST_INVALID_CONTAINER = 'non-existing-element';
        const frameOptions = {
            url: TEST_URL,
            container: TEST_INVALID_CONTAINER,
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const transformedContentOptions = {
            //
        };
        const experienceFrame = () => {
            createExperienceFrame({
                frameOptions,
                contentOptions,
                transformedContentOptions,
                controlOptions: TEST_CONTROL_OPTIONS,
                internalExperience: TEST_INTERNAL_EXPERIENCE,
                experienceIdentifier: TEST_EXPERIENCE_IDENTIFIER,
            });
        };
        expect(experienceFrame).toThrowError();
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.INVALID_CONTAINER,
            eventLevel: ChangeEventLevel.ERROR,
            message: `Invalid container '${TEST_INVALID_CONTAINER}' for the experience`,
            data: {
                experience: TEST_INTERNAL_EXPERIENCE,
            },
        }, {frame: null});
        expect(createIframeMock).not.toHaveBeenCalled();
    });

    it('should not create experience frame without url', () => {
        const frameOptions = {
            // @ts-expect-error - should throw error if url is not provided
            url: undefined,
            container: TEST_CONTAINER,
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const transformedContentOptions = {
            //
        };
        const experienceFrame = () => {
            createExperienceFrame({
                frameOptions,
                contentOptions,
                transformedContentOptions,
                controlOptions: TEST_CONTROL_OPTIONS,
                internalExperience: TEST_INTERNAL_EXPERIENCE,
                experienceIdentifier: TEST_EXPERIENCE_IDENTIFIER,
            });
        };
        expect(experienceFrame).toThrowError();
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.NO_URL,
            eventLevel: ChangeEventLevel.ERROR,
            message: 'Url is required for the experience',
            data: {
                experience: TEST_INTERNAL_EXPERIENCE,
            },
        }, {frame: null});
        expect(createIframeMock).not.toHaveBeenCalled();
    });
});
