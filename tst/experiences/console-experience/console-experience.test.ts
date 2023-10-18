import {ExperienceType} from '@experience/base-experience/types';
import {ChangeEventLevel, ChangeEventName} from '@common/events/types';
import {EventManager} from '@common/event-manager/event-manager';
import {ConsoleExperience} from '@experience/console-experience/console-experience';

describe('ConsoleExperience', () => {
    let TEST_CONTAINER: HTMLElement;
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_CONSOLE_URL = 'https://test.amazon.com/embedding/guid/start/favorites';
    const TEST_OTHER_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_INTERNAL_EXPERIENCE = {
        experienceType: ExperienceType.CONSOLE,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    const TEST_UNRECOGNIZED_CONTENT_OPTION = 'testUnrecognizedContentOption';

    const eventManager = new EventManager();

    const onChangeSpy = jest.fn();

    const TEST_CONTROL_OPTIONS = {
        eventManager,
        contextId: TEST_CONTEXT_ID,
        urlInfo: {
            sessionId: '',
            host: '',
        },
    };

    beforeEach(() => {
        TEST_CONTAINER = window.document.createElement('div');
    });

    afterEach(() => {
        onChangeSpy.mockRestore();
    });

    it('should create console experience', () => {
        const frameOptions = {
            url: TEST_CONSOLE_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const consoleExperience = new ConsoleExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof consoleExperience.send).toEqual('function');
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
    });

    it('should create console experience with correct experience url', () => {
        const frameOptions = {
            url: `${TEST_CONSOLE_URL}?test=test`,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const consoleExperience = new ConsoleExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof consoleExperience.send).toEqual('function');
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
            'https://test.amazon.com/embedding/guid/start/favorites?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&contextId=testContextId&discriminator=0'
        );
    });

    it('should throw error if invalid console experience url', () => {
        const frameOptions = {
            url: undefined,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createConsoleFrameWrapper = () => {
            new ConsoleExperience(
                // @ts-expect-error - Should throw error when URL is not provided
                frameOptions,
                {},
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );
        };
        expect(createConsoleFrameWrapper).toThrowError('Url is required for the experience');
    });

    it('should throw error if not console url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createConsoleFrameWrapper = () => {
            new ConsoleExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        };

        expect(createConsoleFrameWrapper).toThrowError('Invalid console experience URL');
    });

    it('should emit warning if with unrecognized content options', () => {
        const frameOptions = {
            url: TEST_CONSOLE_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const contentOptions = {
            [TEST_UNRECOGNIZED_CONTENT_OPTION]: 'some value',
        };

        const consoleExperience = new ConsoleExperience(
            frameOptions,
            // @ts-expect-error - should throw error when content option has unrecognized properties
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof consoleExperience.send).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith(
            {
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: 'Experience content options contain unrecognized properties',
                data: {
                    unrecognizedContentOptions: [TEST_UNRECOGNIZED_CONTENT_OPTION],
                },
            },
            {frame: null}
        );
    });
});
