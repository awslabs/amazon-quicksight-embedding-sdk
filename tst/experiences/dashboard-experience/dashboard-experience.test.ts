import {DashboardContentOptions} from '@experience/dashboard-experience/types';
import {ExperienceType} from '@experience/base-experience/types';
import {EventManager} from '@common/event-manager/event-manager';
import {DashboardExperience} from '@experience/dashboard-experience/dashboard-experience';
import {ControlExperience} from '@experience/control-experience/control-experience';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '@common/events/types';
import {InfoMessageEventName} from '@common/events/messages';

describe('DashboardExperience', () => {
    let TEST_CONTAINER: HTMLElement;
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_GUID = 'testGuid';
    const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_OTHER_URL = 'https://test.amazon.com/embedding/guid/start/dashboards';
    const TEST_UNRECOGNIZED_CONTENT_OPTION = 'testUnrecognizedContentOption';

    const eventManager = new EventManager();

    const onChangeSpy = jest.fn();

    const TEST_CONTROL_OPTIONS = {
        eventManager,
        contextId: TEST_CONTEXT_ID,
        urlInfo: {
            sessionId: '1234',
            host: 'https://localhost.com',
        },
    };

    beforeEach(() => {
        TEST_CONTAINER = window.document.createElement('div');
    });

    afterEach(() => {
        onChangeSpy.mockRestore();
    });

    it('should create dashboard experience', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            parameters: [
                {
                    Name: 'Test',
                    Values: ['123'],
                },
            ],
        };
        const dashboardExperience = new DashboardExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardExperience.send).toEqual('function');
        expect(typeof dashboardExperience.setParameters).toEqual('function');
        expect(typeof dashboardExperience.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();
    });

    it('should create dashboard experience and format experience url', () => {
        const frameOptions = {
            url: `${TEST_DASHBOARD_URL}?test=test`,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            toolbarOptions: {
                export: {print: true},
            },
        };
        const dashboardExperience = new DashboardExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardExperience.send).toEqual('function');
        expect(typeof dashboardExperience.setParameters).toEqual('function');
        expect(typeof dashboardExperience.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();

        expect(iFrame?.src).toEqual(
            'https://test.amazon.com/embed/guid/dashboards/testDashboardId?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&footerPaddingEnabled=true&printEnabled=true&undoRedoDisabled=true&resetDisabled=true&contextId=testContextId&discriminator=0#'
        );
    });

    it('should create dashboard frame with toolbar options enabled', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            toolbarOptions: {
                undoRedo: true,
                reset: true,
                export: true,
                bookmarks: true,
            },
        };
        const dashboardFrame = new DashboardExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();

        const url = new URL(iFrame!.src);

        expect(url.searchParams.has('undoRedoDisabled')).toBeFalsy();
        expect(url.searchParams.has('resetDisabled')).toBeFalsy();
        expect(url.searchParams.has('printEnabled')).toBeTruthy();
        expect(url.searchParams.has('showBookmarksIcon')).toBeTruthy();
    });

    it('should create dashboard frame with toolbar options disabled', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            toolbarOptions: {
                undoRedo: false,
                reset: false,
                export: false,
                bookmarks: false,
            },
        };
        const dashboardFrame = new DashboardExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();

        const url = new URL(iFrame!.src);

        expect(url.searchParams.has('undoRedoDisabled')).toBeTruthy();
        expect(url.searchParams.has('resetDisabled')).toBeTruthy();
        expect(url.searchParams.has('printEnabled')).toBeFalsy();
        expect(url.searchParams.has('showBookmarksIcon')).toBeFalsy();
    });

    it('should create dashboard frame with sheet options', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            sheetOptions: {
                singleSheet: true,
                initialSheetId: '1234',
                emitSizeChangedEventOnSheetChange: true,
            },
            attributionOptions: {
                overlayContent: true,
            },
        };
        const dashboardFrame = new DashboardExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();

        const url = new URL(iFrame!.src);

        expect(url.searchParams.has('sheetId')).toBeTruthy();
        expect(url.searchParams.has('sheetTabsDisabled')).toBeTruthy();
        expect(url.searchParams.has('resizeOnSheetChange')).toBeTruthy();
        expect(url.searchParams.has('footerPaddingEnabled')).toBeFalsy();
    });

    it('should create dashboard frame with attribution options', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            attributionOptions: {
                overlayContent: false,
            },
        };
        const dashboardFrame = new DashboardExperience(
            frameOptions,
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardFrame.send).toEqual('function');
        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();

        const url = new URL(iFrame!.src);

        expect(url.searchParams.has('footerPaddingEnabled')).toBeTruthy();
    });

    it('should throw error if no url', () => {
        const frameOptions = {
            url: undefined,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createDashboardFrameWrapper = () => {
            new DashboardExperience(
                // @ts-expect-error - Validate that error is thrown when url is omitted from frameOptions
                frameOptions,
                {},
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );
        };
        expect(createDashboardFrameWrapper).toThrowError('Url is required for the experience');
    });

    it('should throw error if not dashboard url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };
        const createDashboardFrameWrapper = () => {
            new DashboardExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createDashboardFrameWrapper).toThrowError('Invalid dashboard experience URL');
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

        const dashboardExperience = new DashboardExperience(
            frameOptions,
            // @ts-expect-error - Validate that warning is emitted for invalid content option
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        expect(typeof dashboardExperience.send).toEqual('function');
        expect(typeof dashboardExperience.setParameters).toEqual('function');
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

    describe('Events', () => {
        let controlExperience: ControlExperience;

        beforeEach(() => {
            const body = window.document.querySelector('body');
            controlExperience = new ControlExperience(body!, TEST_CONTROL_OPTIONS);
        });

        it('Should resize iframe when resizeHeightOnSizeChangeEvent is enabled', () => {
            const frameOptions = {
                url: TEST_DASHBOARD_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
                resizeHeightOnSizeChangedEvent: true,
            };
            const contentOptions: DashboardContentOptions = {
                parameters: [
                    {
                        Name: 'Test',
                        Values: ['123'],
                    },
                ],
            };
            const dashboardExperience = new DashboardExperience(
                frameOptions,
                contentOptions,
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );

            expect(typeof dashboardExperience.send).toEqual('function');
            expect(typeof dashboardExperience.setParameters).toEqual('function');
            expect(typeof dashboardExperience.initiatePrint).toEqual('function');
            const iFrame = TEST_CONTAINER.querySelector('iframe');
            expect(iFrame).toBeDefined();

            expect(iFrame?.height).toEqual('0px');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: {
                            experienceType: ExperienceType.DASHBOARD,
                            discriminator: 0,
                            contextId: TEST_CONTEXT_ID,
                            dashboardId: TEST_DASHBOARD_ID,
                        },
                        eventName: InfoMessageEventName.SIZE_CHANGED,
                        message: {
                            height: '500',
                        },
                    },
                })
            );

            expect(iFrame?.height).toEqual('500px');
        });
    });
    describe('Actions', () => {
        let dashboardExperience: DashboardExperience;
        const mockSend = jest.fn();
        const ACTIONS_TEST_CONTAINER = window.document.createElement('div');

        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: ACTIONS_TEST_CONTAINER,
            width: '800px',
        };

        beforeEach(() => {
            dashboardExperience = new DashboardExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
            ACTIONS_TEST_CONTAINER.querySelector('iframe')?.dispatchEvent(new Event('load'));
            jest.spyOn(dashboardExperience, 'send').mockImplementation(mockSend);
        });

        it('should emit ADD_VISUAL_ACTIONS event when addVisualActions is called', () => {
            dashboardExperience.addVisualActions(TEST_GUID, TEST_GUID, [
                {
                    CustomActionId: TEST_GUID,
                    ActionOperations: [{CallbackOperation: {EmbeddingMessage: {}}}],
                    Status: 'ENABLED',
                    Name: 'Custom-Action',
                    Trigger: 'DATA_POINT_CLICK',
                },
            ]);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.ADD_VISUAL_ACTIONS,
                })
            );
        });

        it('should emit SET_VISUAL_ACTIONS event when setVisualActions is called', () => {
            dashboardExperience.setVisualActions(TEST_GUID, TEST_GUID, [
                {
                    CustomActionId: TEST_GUID,
                    ActionOperations: [{CallbackOperation: {EmbeddingMessage: {}}}],
                    Status: 'ENABLED',
                    Name: 'Custom-Action',
                    Trigger: 'DATA_POINT_CLICK',
                },
            ]);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.SET_VISUAL_ACTIONS,
                })
            );
        });

        it('should emit GET_VISUAL_ACTIONS event when getVisualActions is called', () => {
            dashboardExperience.getVisualActions(TEST_GUID, TEST_GUID);
            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.GET_VISUAL_ACTIONS,
                })
            );
        });

        it('should emit REMOVE_VISUAL_ACTIONS event when removeVisualActions is called', () => {
            dashboardExperience.removeVisualActions(TEST_GUID, TEST_GUID, [
                {
                    CustomActionId: TEST_GUID,
                    ActionOperations: [{CallbackOperation: {EmbeddingMessage: {}}}],
                    Status: 'ENABLED',
                    Name: 'Custom-Action',
                    Trigger: 'DATA_POINT_CLICK',
                },
            ]);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.REMOVE_VISUAL_ACTIONS,
                })
            );
        });

        it('should emit INITIATE_PRINT event when initiatePrint is called', () => {
            dashboardExperience.initiatePrint();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.INITIATE_PRINT,
            });
        });

        it('should emit UNDO event when undo is called', () => {
            dashboardExperience.undo();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.UNDO,
            });
        });

        it('should emit REDO event when redo is called', () => {
            dashboardExperience.redo();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.REDO,
            });
        });

        it('should emit TOGGLE_BOOKMARKS_PANE event when toggleBookmarksPane is called', () => {
            dashboardExperience.toggleBookmarksPane();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.TOGGLE_BOOKMARKS_PANE,
            });
        });

        it('should emit GET_PARAMETERS event when getParameters is called', async () => {
            mockSend.mockResolvedValue(undefined);

            const val = await dashboardExperience.getParameters();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_PARAMETERS,
            });
            expect(val).toEqual([]);
        });

        it('should emit GET_SHEETS event when getSheets is called', async () => {
            mockSend.mockResolvedValue(undefined);

            const val = await dashboardExperience.getSheets();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_SHEETS,
            });
            expect(val).toEqual([]);
        });

        it('should emit GET_SELECTED_SHEET_ID event when getSelectedSheetId is called', async () => {
            mockSend.mockResolvedValue(undefined);
            const val = await dashboardExperience.getSelectedSheetId();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_SELECTED_SHEET_ID,
            });

            expect(val).toEqual('');
        });

        it('should emit SET_SELECTED_SHEET_ID event when getSelectedSheetId is called', () => {
            dashboardExperience.setSelectedSheetId('1234');
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.SET_SELECTED_SHEET_ID,
                message: {
                    SheetId: '1234',
                },
            });
        });

        it('should emit NAVIGATE_TO_DASHBOARD event when navigateToDashboard is called', () => {
            dashboardExperience.navigateToDashboard('1234');
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.NAVIGATE_TO_DASHBOARD,
                message: {
                    DashboardId: '1234',
                },
            });
        });

        it('should emit SET_PARAMETERS event when setParameters is called', () => {
            const parameters = [{Values: ['1234'], Name: 'State'}];
            dashboardExperience.setParameters(parameters);
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.SET_PARAMETERS,
                message: parameters,
            });
        });

        it('should emit GET_SHEET_VISUALS event when getSheetVisuals is called', async () => {
            mockSend.mockResolvedValue(undefined);

            const val = await dashboardExperience.getSheetVisuals('1234');
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_SHEET_VISUALS,
                message: {
                    SheetId: '1234',
                },
            });

            expect(val).toEqual([]);
        });

        it('should emit RESET event when reset is called', () => {
            dashboardExperience.reset();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.RESET,
            });
        });
    });
});
