import eventManagerBuilder from '../../../src/eventManager';
import {ChangeEventLevel, ExperienceType, ChangeEventName} from '../../../src/enums';
import {createControlFrame} from '../../../src/experiences/control';
import {ControlOptions, EventManager} from '../../../src/types';

describe('createControlFrame', () => {
    const TEST_CONTAINER: HTMLBodyElement = window.document.body as HTMLBodyElement;
    const TEST_CONTEXT_ID = 'testContextId';

    const eventManager: EventManager = eventManagerBuilder();

    const onChangeSpy = jest.fn();

    const TEST_CONTROL_OPTIONS: ControlOptions = {
        eventManager,
        contextId: TEST_CONTEXT_ID,
        urlInfo: {
            host: 'https://test.amazon.com',
            guid: undefined,
        },
    };

    const TEST_INTERNAL_EXPERIENCE = {
        experienceType: ExperienceType.CONTROL,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    beforeEach(() => {
        jest.spyOn(eventManager, 'experienceEventListenerBuilder').mockImplementation(() => ({
            addExperienceEventListener: jest.fn(),
            removeExperienceEventListener: jest.fn(),
            invokeExperienceEventListener: jest.fn(),
        }));
    });

    afterEach(() => {
        onChangeSpy.mockRestore();
    });

    it('should create control frame', () => {
        const controlFrame = createControlFrame(TEST_CONTAINER, TEST_CONTROL_OPTIONS, onChangeSpy);
        expect(typeof controlFrame.internalSend).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.FRAME_STARTED,
            eventLevel: ChangeEventLevel.INFO,
            message: 'Creating the frame',
            data: {
                experience: TEST_INTERNAL_EXPERIENCE,
            },
        }, {frame: null});
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).not.toEqual(undefined);
    });
});
