import eventManagerBuilder from '../../../src/eventManager';
import {ChangeEventLevel, ExperienceType, ChangeEventName, MessageEventName} from '../../../src/enums';
import {createVisualFrame} from '../../../src/experiences/visual';
import {EventManager, VisualFrame} from '../../../src/types';

const mockSend = jest.fn();

jest.mock('../../../src/experiences/createExperienceFrame', () => ({
    __esModule: true,
    default: (...args: never[]) => {
        const {default: createExperienceFrame} = jest.requireActual('../../../src/experiences/createExperienceFrame');
        return {
            ...createExperienceFrame(...args),
            internalAddEventListener: jest.fn(),
            internalSend: mockSend,
        };
    }
}));

describe('createVisualFrame', () => {
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_SHEET_ID = 'testSheetId';
    const TEST_VISUAL_ID = 'testVisualId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_GUID = 'testGuid';
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
        }, {frame: null});
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).not.toEqual(undefined);
    });

    it('should throw error if no url', () => {
        const frameOptions = {
            // @ts-expect-error - Validate that error is thrown when URL is omitted from frameOptions
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

        // @ts-expect-error - Validate that warning is emitted for invalid content option
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
        }, {frame: null});
    });

    describe('Actions', () => {
        let visualFrame: VisualFrame;
        const frameOptions = {
            url: TEST_VISUAL_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };


        beforeEach(() => {
            visualFrame =  createVisualFrame(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        });

        it('should emit ADD_VISUAL_ACTIONS event when addVisualActions is called', () => {
            visualFrame.addActions([{
                CustomActionId: TEST_GUID,
                ActionOperations: [{CallbackOperation: {EmbeddingMessage: {}}}],
                Status: 'ENABLED',
                Name: 'Custom-Action',
                Trigger: 'DATA_POINT_CLICK'
            }]);

            expect(mockSend).toBeCalledWith(expect.objectContaining({
                eventName: MessageEventName.ADD_VISUAL_ACTIONS
            }));
        });

        it('should emit SET_VISUAL_ACTIONS event when setVisualActions is called', () => {
            visualFrame.setActions([{
                CustomActionId: TEST_GUID,
                ActionOperations: [{CallbackOperation: {EmbeddingMessage: {}}}],
                Status: 'ENABLED',
                Name: 'Custom-Action',
                Trigger: 'DATA_POINT_CLICK'
            }]);

            expect(mockSend).toBeCalledWith(expect.objectContaining({
                eventName: MessageEventName.SET_VISUAL_ACTIONS
            }));
        });

        it('should emit GET_VISUAL_ACTIONS event when getVisualActions is called', () => {
            visualFrame.getActions();
            expect(mockSend).toBeCalledWith(expect.objectContaining({
                eventName: MessageEventName.GET_VISUAL_ACTIONS
            }));
        });

        it('should emit REMOVE_VISUAL_ACTIONS event when removeVisualActions is called', () => {
            visualFrame.removeActions([{
                CustomActionId: TEST_GUID,
                ActionOperations: [{CallbackOperation: {EmbeddingMessage: {}}}],
                Status: 'ENABLED',
                Name: 'Custom-Action',
                Trigger: 'DATA_POINT_CLICK'
            }]);

            expect(mockSend).toBeCalledWith(expect.objectContaining({
                eventName: MessageEventName.REMOVE_VISUAL_ACTIONS
            }));
        });
    });
});
