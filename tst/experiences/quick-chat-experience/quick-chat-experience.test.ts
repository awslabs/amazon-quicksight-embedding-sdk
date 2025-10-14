import {ExperienceType, FrameOptions} from '@experience/base-experience/types';
import {ControlOptions} from '@experience/control-experience/types';
import {EventManager} from '@common/event-manager/event-manager';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '@common/events/types';
import {QuickChatExperience} from '@experience/quick-chat-experience/quick-chat-experience';
import {QuickChatContentOptions} from '@experience/quick-chat-experience/types';
import {ControlExperience} from '@experience/control-experience/control-experience';
import {InfoMessageEventName} from '@common/events/messages';

describe('Quick Chat Experience', () => {
    let TEST_CONTAINER: HTMLElement;
    const TEST_AGENT_ARN = 'arn';
    const TEST_PROMPT = 'initial prompt';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_URL = 'https://test.amazon.com/embedding/af058f19046a4659bc3f233366f9b2af/quick/chat';
    const TEST_INTERNAL_EXPERIENCE = {
        experienceType: ExperienceType.QUICKCHAT,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    const onChangeSpy = jest.fn();

    let TEST_CONTROL_OPTIONS: ControlOptions;

    beforeAll(() => {
        const eventManager = new EventManager();

        TEST_CONTROL_OPTIONS = {
            eventManager,
            contextId: TEST_CONTEXT_ID,
            urlInfo: {
                sessionId: '1234',
                host: 'https://localhost.com',
            },
        };
    });

    beforeEach(() => {
        TEST_CONTAINER = window.document.createElement('div');
    });

    afterEach(() => {
        onChangeSpy.mockRestore();
    });

    it('should create quick chat experience', () => {
        const frameOptions: FrameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const contentOptions: QuickChatContentOptions = {
            fixedAgentArn: TEST_AGENT_ARN,
            initialPrompt: TEST_PROMPT,
        };

        const quickChatExperience = new QuickChatExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof quickChatExperience.send).toEqual('function');
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
            `https://test.amazon.com/embedding/af058f19046a4659bc3f233366f9b2af/quick/chat?punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=2.10.2&contextId=testContextId&discriminator=0&fixedAgentArn=${TEST_AGENT_ARN}`
        );
    });

    it('should create quick chat experience without parameters', () => {
        const frameOptions: FrameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const quickChatExperience = new QuickChatExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

        expect(typeof quickChatExperience.send).toEqual('function');

        expect(TEST_CONTAINER.querySelector('iframe')?.src).toEqual(
            `https://test.amazon.com/embedding/af058f19046a4659bc3f233366f9b2af/quick/chat?punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=2.10.2&contextId=testContextId&discriminator=0`
        );
    });

    it('should emit warning if with unrecognized content options', () => {
        const frameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            unknownOption: 'test',
        } as any;

        new QuickChatExperience(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(onChangeSpy).toHaveBeenCalledWith(
            {
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: 'Experience content options contain unrecognized properties',
                data: {
                    unrecognizedContentOptions: ['unknownOption'],
                },
            },
            {frame: null}
        );
    });

    it('should send an initial prompt on EXPERIENCE_INITIALIZED if provided', () => {
        const body = window.document.querySelector('body');
        const controlExperience = new ControlExperience(body!, TEST_CONTROL_OPTIONS);
        const frameOptions: FrameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const quickChatExperience = new QuickChatExperience(
            frameOptions,
            {initialPrompt: TEST_PROMPT},
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );
        const mockSend = jest.fn();
        jest.spyOn(quickChatExperience, 'send').mockImplementation(mockSend);

        controlExperience.controlFrameMessageListener(
            new MessageEvent('message', {
                data: {
                    eventTarget: {
                        experienceType: ExperienceType.QUICKCHAT,
                        discriminator: 0,
                        contextId: TEST_CONTEXT_ID,
                    },
                    eventName: InfoMessageEventName.EXPERIENCE_INITIALIZED,
                    message: {},
                },
            })
        );

        expect(quickChatExperience.send).toHaveBeenCalledWith(
            expect.objectContaining({
                eventName: MessageEventName.SEND_PROMPT,
                message: TEST_PROMPT,
            })
        );
    });

    it('should not send an initial prompt on EXPERIENCE_INITIALIZED if not provided', () => {
        const body = window.document.querySelector('body');
        const controlExperience = new ControlExperience(body!, TEST_CONTROL_OPTIONS);
        const frameOptions: FrameOptions = {
            url: TEST_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const quickChatExperience = new QuickChatExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        const mockSend = jest.fn();
        jest.spyOn(quickChatExperience, 'send').mockImplementation(mockSend);

        controlExperience.controlFrameMessageListener(
            new MessageEvent('message', {
                data: {
                    eventTarget: {
                        experienceType: ExperienceType.QUICKCHAT,
                        discriminator: 0,
                        contextId: TEST_CONTEXT_ID,
                    },
                    eventName: InfoMessageEventName.EXPERIENCE_INITIALIZED,
                    message: {},
                },
            })
        );

        expect(quickChatExperience.send).not.toHaveBeenCalled();
    });

    it('should throw error if not Quick Chat url', () => {
        const frameOptions = {
            url: 'https://exmaple.com',
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createQSearchFrameWrapper = () => {
            new QuickChatExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createQSearchFrameWrapper).toThrow(new Error('Invalid quick chat experience url'));
    });
});
