import eventManagerBuilder from '../../../src/eventManager';
import {ChangeEventLevel, ExperienceType, ChangeEventName} from '../../../src/enums';
import {createConsoleFrame} from '../../../src/experiences/console';
import {EventManager} from '../../../src/types';

describe('createConsoleFrame', () => {
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_QSEARCH_URL = 'https://test.amazon.com/embedding/guid/start/favorites';
    const TEST_OTHER_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_INTERNAL_EXPERIENCE = {
        experienceType: ExperienceType.CONSOLE,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };
    const TEST_UNRECOGNIZED_CONTENT_OPTION = 'testUnrecognizedContentOption';

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
        onChangeSpy.mockRestore();
    });

    it('should create console frame', () => {
        const frameOptions = {
            url: TEST_QSEARCH_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            fitToIframeWidth: true,
        };
        const qsearchFrame = createConsoleFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof qsearchFrame.send).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.FRAME_STARTED,
            eventLevel: ChangeEventLevel.INFO,
            message: 'Creating the frame',
            data: {
                experience: TEST_INTERNAL_EXPERIENCE,
            },
        });
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).not.toEqual(undefined);
    });

    it('should throw error if no url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };
        const contentOptions = {
            fitToIframeWidth: true,
        };
        const createConsoleFrameWrapper = () => {
            createConsoleFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createConsoleFrameWrapper).toThrowError('Invalid console experience url');
    });

    it('should throw error if not console url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };
        const contentOptions = {
            fitToIframeWidth: true,
        };
        const createConsoleFrameWrapper = () => {
            createConsoleFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createConsoleFrameWrapper).toThrowError('Invalid console experience url');
    });

    it('should emit warning if with unrecognized content options', () => {
        const frameOptions = {
            url: TEST_QSEARCH_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            [TEST_UNRECOGNIZED_CONTENT_OPTION]: 'some value',
        };
        const qsearchFrame = createConsoleFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof qsearchFrame.send).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
            eventLevel: ChangeEventLevel.WARN,
            message: 'Console content options contain unrecognized properties',
            data: {
                unrecognizedContentOptions: [TEST_UNRECOGNIZED_CONTENT_OPTION],
            },
        });
    });
});
