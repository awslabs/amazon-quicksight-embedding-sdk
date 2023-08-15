import eventManagerBuilder from '../../../src/eventManager';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '../../../src/enums';
import {createDashboardFrame} from '../../../src/experiences/dashboard';
import {DashboardFrame, EventManager, TransformedDashboardContentOptions} from '../../../src/types';
import createExperienceFrame from '../../../src/experiences/createExperienceFrame';

const mockSend = jest.fn();

jest.mock('../../../src/experiences/createExperienceFrame', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        internalAddEventListener: jest.fn(),
        internalSend: mockSend,
    })),
}));

const createExperienceFrameMock = jest.mocked(createExperienceFrame, true);

describe('createDashboardFrame', () => {
    const TEST_CONTAINER: HTMLElement = window.document.createElement('div');
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_GUID = 'testGuid';
    const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_OTHER_URL = 'https://test.amazon.com/embedding/guid/start/dashboards';
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
        createExperienceFrameMock.mockClear();
    });

    it('should create dashboard frame', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            //
        };
        const dashboardFrame = createDashboardFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).not.toEqual(undefined);
        const transformedContentOptions: TransformedDashboardContentOptions = createExperienceFrameMock.mock.calls[0][0].transformedContentOptions;
        expect(transformedContentOptions.undoRedoDisabled).toBe(true);
        expect(transformedContentOptions.resetDisabled).toBe(true);
        expect(transformedContentOptions.printEnabled).toBe(undefined);
        expect(transformedContentOptions.showBookmarksIcon).toBe(undefined);
    });

    it('should create dashboard frame with toolbar options', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            toolbarOptions: {
                undoRedo: true,
                reset: true,
                export: true,
                bookmarks: true,
            },
        };
        const dashboardFrame = createDashboardFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).not.toEqual(undefined);
        const transformedContentOptions: TransformedDashboardContentOptions = createExperienceFrameMock.mock.calls[0][0].transformedContentOptions;
        expect(transformedContentOptions.undoRedoDisabled).toBe(undefined);
        expect(transformedContentOptions.resetDisabled).toBe(undefined);
        expect(transformedContentOptions.printEnabled).toBe(true);
        expect(transformedContentOptions.showBookmarksIcon).toBe(true);
    });

    it('should throw error if no url', () => {
        const frameOptions = {
            // @ts-expect-error - Validate that error is thrown when url is omitted from frameOptions
            url: undefined,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createDashboardFrameWrapper = () => {
            createDashboardFrame(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createDashboardFrameWrapper).toThrowError('Url is required for the experience');
    });

    it('should throw error if not dashboard url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };
        const contentOptions = {
            //
        };
        const createDashboardFrameWrapper = () => {
            createDashboardFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createDashboardFrameWrapper).toThrowError('Invalid dashboard experience url');
    });

    it('should emit warning if with unrecognized content options', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            [TEST_UNRECOGNIZED_CONTENT_OPTION]: 'some value',
        };

        // @ts-expect-error - Validate that warning is emitted for invalid content option
        const dashboardFrame = createDashboardFrame(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(onChangeSpy).toHaveBeenCalledWith({
            eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
            eventLevel: ChangeEventLevel.WARN,
            message: 'Dashboard content options contain unrecognized properties',
            data: {
                unrecognizedContentOptions: [TEST_UNRECOGNIZED_CONTENT_OPTION],
            },
        }, {frame: null});
    });
    
    describe('Actions', () => {
        let dashboardFrame: DashboardFrame;
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px'
        };

        beforeEach(() => {
            dashboardFrame = createDashboardFrame(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        });

        it('should emit ADD_VISUAL_ACTIONS event when addVisualActions is called', () => {
            dashboardFrame.addVisualActions(TEST_GUID, TEST_GUID, [{
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
            dashboardFrame.setVisualActions(TEST_GUID, TEST_GUID, [{
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
            dashboardFrame.getVisualActions(TEST_GUID, TEST_GUID);
            expect(mockSend).toBeCalledWith(expect.objectContaining({
                eventName: MessageEventName.GET_VISUAL_ACTIONS
            }));
        });

        it('should emit REMOVE_VISUAL_ACTIONS event when removeVisualActions is called', () => {
            dashboardFrame.removeVisualActions(TEST_GUID, TEST_GUID, [{
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
