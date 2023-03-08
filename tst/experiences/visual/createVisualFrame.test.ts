import eventManagerBuilder from '../../../src/eventManager';
import {ChangeEventLevel, ExperienceType, ChangeEventName} from '../../../src/enums';
import {createVisualFrame} from '../../../src/experiences/visual';
import {EventManager} from '../../../src/types';

describe('createVisualFrame', () => {
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_SHEET_ID = 'testSheetId';
    const TEST_VISUAL_ID = 'testVisualId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_VISUAL_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}/sheets/${TEST_SHEET_ID}/visuals/${TEST_VISUAL_ID}`;
    const TEST_OTHER_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_INTERNAL_EXPERIENCE = {
        experienceType: ExperienceType.VISUAL,
        dashboardId: TEST_DASHBOARD_ID,
        sheetId: TEST_SHEET_ID,
        visualId: TEST_VISUAL_ID,
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

    it('should create visual frame', () => {
        const frameOptions = {
            url: TEST_VISUAL_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            fitToIframeWidth: true,
        };
        const visualFrame = createVisualFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof visualFrame.send).toEqual('function');
        expect(typeof visualFrame.setParameters).toEqual('function');
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
            url: undefined,
            container: TEST_CONTAINER,
            width: '800px',
        };
        const contentOptions = {
            fitToIframeWidth: true,
        };
        const createVisualFrameWrapper = () => {
            createVisualFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createVisualFrameWrapper).toThrowError('Url is required for the experience');
    });

    it('should throw error if not visual url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };
        const contentOptions = {
            fitToIframeWidth: true,
        };
        const createVisualFrameWrapper = () => {
            createVisualFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createVisualFrameWrapper).toThrowError('Invalid visual experience url');
    });

    it('should emit warning if with unrecognized content options', () => {
        const frameOptions = {
            url: TEST_VISUAL_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            [TEST_UNRECOGNIZED_CONTENT_OPTION]: 'some value',
        };
        const visualFrame = createVisualFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof visualFrame.send).toEqual('function');
        expect(typeof visualFrame.setParameters).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
            eventLevel: ChangeEventLevel.WARN,
            message: 'Visual content options contain unrecognized properties',
            data: {
                unrecognizedContentOptions: [TEST_UNRECOGNIZED_CONTENT_OPTION],
            },
        });
    });
});
