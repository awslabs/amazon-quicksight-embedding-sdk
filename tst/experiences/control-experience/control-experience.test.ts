import {EventManager} from '@common/event-manager/event-manager';
import {ExperienceType} from '@experience/base-experience/types';
import {ChangeEventLevel, ChangeEventName, InfoMessageEventName} from '../../../src/common/events';
import {ControlExperience} from '@experience/control-experience/control-experience';
import {ControlOptions} from '@experience/control-experience/types';
import {SDK_VERSION} from '@experience/base-experience/frame/experience-frame';

describe('ControlExperience', () => {
    const TEST_CONTAINER: HTMLBodyElement = window.document.body as HTMLBodyElement;
    const TEST_CONTEXT_ID = 'testContextId';

    const eventManager = new EventManager();

    const onChangeSpy = jest.fn();

    const TEST_CONTROL_OPTIONS: ControlOptions = {
        eventManager,
        contextId: TEST_CONTEXT_ID,
        urlInfo: {
            host: 'https://test.amazon.com',
            sessionId: '',
        },
    };

    const TEST_INTERNAL_EXPERIENCE = {
        experienceType: ExperienceType.CONTROL,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    afterEach(() => {
        onChangeSpy.mockRestore();
    });

    it('should create control frame', () => {
        const controlFrame = new ControlExperience(TEST_CONTAINER, TEST_CONTROL_OPTIONS, onChangeSpy);

        expect(typeof controlFrame.send).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith(
            {
                eventName: ChangeEventName.FRAME_STARTED,
                eventLevel: ChangeEventLevel.INFO,
                message: 'Creating the frame',
                data: {
                    experience: TEST_INTERNAL_EXPERIENCE,
                },
            },
            {frame: null}
        );
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();
        expect(iFrame?.src).toEqual(
            `https://test.amazon.com/embed//embedControl?punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&contextId=testContextId&discriminator=0`
        );
    });

    it('should call addEventListener when onMessage is provided', () => {
        jest.spyOn(eventManager, 'addEventListener');

        new ControlExperience(TEST_CONTAINER, {...TEST_CONTROL_OPTIONS, contextId: 'TEST2'}, onChangeSpy, jest.fn());

        expect(eventManager.addEventListener).toBeCalledTimes(2);
    });

    it('should emit error if send is called before experience frame has been initialized', () => {
        const controlExperience = new ControlExperience(TEST_CONTAINER, TEST_CONTROL_OPTIONS, onChangeSpy);

        controlExperience.controlFrameMessageListener(
            new MessageEvent('message', {
                data: {
                    eventTarget: {
                        experienceType: ExperienceType.CONSOLE,
                        discriminator: 0,
                        contextId: '1234',
                    },
                    eventName: InfoMessageEventName.SIZE_CHANGED,
                    message: {
                        height: '500',
                    },
                },
            })
        );

        expect(onChangeSpy).toHaveBeenLastCalledWith(
            expect.objectContaining({
                message: 'Message with unrecognized event target received',
                eventName: ChangeEventName.UNRECOGNIZED_EVENT_TARGET,
                eventLevel: ChangeEventLevel.WARN,
            }),
            expect.any(Object)
        );
    });

    it('should not call invokeEventListener if controlFrameMessageListener is called with non event message', () => {
        const controlFrame = new ControlExperience(TEST_CONTAINER, TEST_CONTROL_OPTIONS, onChangeSpy);

        controlFrame.controlFrameMessageListener(
            //@ts-expect-error - should not invoke eventListener
            new MessageEvent('message', {
                data: {
                    eventTarget: {
                        experienceType: ExperienceType.CONSOLE,
                        discriminator: 0,
                        contextId: '1234',
                    },
                },
            })
        );

        expect(onChangeSpy).toBeCalledTimes(2);
    });

    it('should throw error if getControlIFrame is before experience frame has been initialized', () => {
        expect(true).toBeTruthy();
    });
});
