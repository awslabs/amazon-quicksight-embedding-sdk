import eventManagerBuilder from '../../src/eventManager';
import {ChangeEventLevel, ExperienceType, ChangeEventName} from '../../src/enums';
import createExperienceFrame from '../../src/experiences/createExperienceFrame';
import {EventManager, InternalControlExperience} from '../../src/types';
import createIframe from '../../src/commons/createIframe';

jest.mock('../../src/commons/createIframe', () => ({
    __esModule: true,
    default: jest.fn(() => {
        return true;
    }),
}));

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
        const experienceFrame = createExperienceFrame(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            TEST_INTERNAL_EXPERIENCE,
            TEST_EXPERIENCE_IDENTIFIER
        );
        expect(createIframe).toHaveBeenCalled();
        const createFrameArguments = createIframe.mock.calls[0][0];
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
        const experienceFrame = createExperienceFrame(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            TEST_INTERNAL_EXPERIENCE,
            TEST_EXPERIENCE_IDENTIFIER
        );
        expect(createIframe).toHaveBeenCalled();
        const createFrameArguments = createIframe.mock.calls[0][0];
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
        const experienceFrame = createExperienceFrame(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            TEST_INTERNAL_EXPERIENCE,
            TEST_EXPERIENCE_IDENTIFIER
        );
        expect(createIframe).toHaveBeenCalled();
        const createFrameArguments = createIframe.mock.calls[0][0];
        expect(createFrameArguments.src.startsWith(TEST_URL)).toBe(true);
        expect(createFrameArguments.container).toEqual(TEST_CONTAINER);
        expect(createFrameArguments.width).toEqual(TEST_WIDTH);
        expect(createFrameArguments.height).toEqual(TEST_HEIGHT);
        expect(typeof experienceFrame.internalSend).toEqual('function');
    });

    it('should not create experience frame without container', () => {
        const frameOptions = {
            url: TEST_URL,
            container: undefined,
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const experienceFrame = () => {
            createExperienceFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, TEST_INTERNAL_EXPERIENCE, TEST_EXPERIENCE_IDENTIFIER);
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
        expect(createIframe).not.toHaveBeenCalled();
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
        const experienceFrame = () => {
            createExperienceFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, TEST_INTERNAL_EXPERIENCE, TEST_EXPERIENCE_IDENTIFIER);
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
        expect(createIframe).not.toHaveBeenCalled();
    });

    it('should not create experience frame without url', () => {
        const frameOptions = {
            url: undefined,
            container: TEST_CONTAINER,
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const experienceFrame = () => {
            createExperienceFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, TEST_INTERNAL_EXPERIENCE, TEST_EXPERIENCE_IDENTIFIER);
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
        expect(createIframe).not.toHaveBeenCalled();
    });
});
