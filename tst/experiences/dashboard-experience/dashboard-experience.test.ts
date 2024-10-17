import {DashboardContentOptions} from '@experience/dashboard-experience/types';
import {ExperienceType} from '@experience/base-experience/types';
import {EventManager} from '@common/event-manager/event-manager';
import {DashboardExperience} from '@experience/dashboard-experience/dashboard-experience';
import {ControlExperience} from '@experience/control-experience/control-experience';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '@common/events/types';
import {InfoMessageEventName} from '@common/events/messages';
import {SDK_VERSION} from '@experience/base-experience/frame/experience-frame';
import type {CrossDatasetTypes, WidgetStatus} from '@aws-sdk/client-quicksight';

describe('DashboardExperience', () => {
    let TEST_CONTAINER: HTMLElement;
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_GUID = 'testGuid';
    const TEST_THEME_ARN = 'arn:aws:quicksight::aws:theme/MIDNIGHT';
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
            `https://test.amazon.com/embed/guid/dashboards/testDashboardId?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&footerPaddingEnabled=true&printEnabled=true&undoRedoDisabled=true&resetDisabled=true&contextId=testContextId&discriminator=0#`
        );
    });

    it('should create dashboard experience and add viewId to url', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            viewId: 'testViewId',
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
            `https://test.amazon.com/embed/guid/dashboards/testDashboardId/views/testViewId?punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&footerPaddingEnabled=true&undoRedoDisabled=true&resetDisabled=true&contextId=testContextId&discriminator=0#`
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
                scheduling: true,
                recentSnapshots: true,
                thresholdAlerts: true,
                executiveSummary: true,
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
        expect(url.searchParams.has('showThresholdAlertsIcon')).toBeTruthy();
        expect(url.searchParams.has('showSchedulingIcon')).toBeTruthy();
        expect(url.searchParams.has('showRecentSnapshotsIcon')).toBeTruthy();
        expect(url.searchParams.has('showExecutiveSummaryIcon')).toBeTruthy();
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
                scheduling: false,
                recentSnapshots: false,
                thresholdAlerts: false,
                executiveSummary: false,
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
        expect(url.searchParams.has('showThresholdAlertsIcon')).toBeFalsy();
        expect(url.searchParams.has('showSchedulingIcon')).toBeFalsy();
        expect(url.searchParams.has('showRecentSnapshotsIcon')).toBeFalsy();
        expect(url.searchParams.has('showExecutiveSummaryIcon')).toBeFalsy();
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

    it('should create dashboard frame with themeArn options', () => {
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            themeOptions: {themeArn: TEST_THEME_ARN},
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
        expect(url.searchParams.has('themeArn')).toBeTruthy();
    });

    it('should create dashboard frame with themeOverride', () => {
        const body = window.document.querySelector('body');
        const controlExperience = new ControlExperience(body!, TEST_CONTROL_OPTIONS);

        const mockSend = jest.fn();
        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions: DashboardContentOptions = {
            themeOptions: {
                themeOverride: {Typography: {FontFamilies: [{FontFamily: 'Comic Neue'}]}},
                preloadThemes: ['arn:aws:quicksight::aws:theme/RAINIER', 'arn:aws:quicksight::aws:theme/MIDNIGHT'],
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
        jest.spyOn(dashboardFrame, 'send').mockImplementation(mockSend);

        expect(typeof dashboardFrame.setParameters).toEqual('function');
        expect(typeof dashboardFrame.initiatePrint).toEqual('function');
        expect(typeof dashboardFrame.setThemeOverride).toEqual('function');
        expect(typeof dashboardFrame.createSharedView).toEqual('function');
        expect(typeof dashboardFrame.setPreloadThemes).toEqual('function');

        controlExperience.controlFrameMessageListener(
            new MessageEvent('message', {
                data: {
                    eventTarget: {
                        experienceType: ExperienceType.DASHBOARD,
                        discriminator: 0,
                        contextId: TEST_CONTEXT_ID,
                        dashboardId: TEST_DASHBOARD_ID,
                    },
                    eventName: InfoMessageEventName.EXPERIENCE_INITIALIZED,
                    message: {},
                },
            })
        );

        expect(dashboardFrame.send).toBeCalledWith(
            expect.objectContaining({
                eventName: MessageEventName.SET_THEME_OVERRIDE,
            })
        );

        expect(dashboardFrame.send).toBeCalledWith(
            expect.objectContaining({
                eventName: MessageEventName.PRELOAD_THEMES,
            })
        );
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

            expect(iFrame?.height).toEqual('100%');

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

        const FILTER_GROUPS = [
            {
                FilterGroupId: '123',
                Filters: [],
                ScopeConfiguration: {
                    AllSheets: true,
                },
                CrossDataset: 'ALL_DATASETS' as CrossDatasetTypes,
                Status: 'ENABLED' as WidgetStatus,
            },
        ];

        const frameOptions = {
            url: TEST_DASHBOARD_URL,
            container: ACTIONS_TEST_CONTAINER,
            width: '800px',
        };

        beforeEach(() => {
            dashboardExperience = new DashboardExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
            ACTIONS_TEST_CONTAINER.querySelector('iframe')?.dispatchEvent(new Event('load'));
            mockSend.mockClear();
            jest.spyOn(dashboardExperience, 'send').mockImplementation(mockSend);
        });

        it('should emit ADD_FILTER_GROUPS event when addFilterGroups is called', () => {
            dashboardExperience.addFilterGroups(FILTER_GROUPS);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.ADD_FILTER_GROUPS,
                })
            );
        });

        it('should emit UPDATE_FILTER_GROUPS event when updateFilterGroups is called', () => {
            dashboardExperience.updateFilterGroups(FILTER_GROUPS);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.UPDATE_FILTER_GROUPS,
                })
            );
        });

        it('should emit REMOVE_FILTER_GROUPS event when removeFilterGroups is called with models', () => {
            dashboardExperience.removeFilterGroups(FILTER_GROUPS);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.REMOVE_FILTER_GROUPS,
                })
            );
        });

        it('should emit REMOVE_FILTER_GROUPS event when removeFilterGroups is called with ids', () => {
            dashboardExperience.removeFilterGroups(FILTER_GROUPS.map(filterGroup => filterGroup.FilterGroupId));

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.REMOVE_FILTER_GROUPS,
                })
            );
        });

        it('should emit GET_FILTER_GROUPS_FOR_SHEET event when getFilterGroupsForSheet is called', () => {
            mockSend.mockResolvedValue({message: []});
            dashboardExperience.getFilterGroupsForSheet(TEST_GUID);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.GET_FILTER_GROUPS_FOR_SHEET,
                })
            );
        });

        it('should throw error when getFilterGroupsForSheet returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getFilterGroupsForSheet(TEST_GUID);
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve filter groups for the sheet');
        });

        it('should emit GET_FILTER_GROUPS_FOR_VISUAL event when getFilterGroupsForVisual is called', () => {
            mockSend.mockResolvedValue({message: []});
            dashboardExperience.getFilterGroupsForVisual(TEST_GUID, TEST_GUID);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.GET_FILTER_GROUPS_FOR_VISUAL,
                })
            );
        });

        it('should throw error when getFilterGroupsForVisual returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getFilterGroupsForVisual(TEST_GUID, TEST_GUID);
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve filter groups for the visual');
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
            mockSend.mockResolvedValue({message: []});
            dashboardExperience.getVisualActions(TEST_GUID, TEST_GUID);
            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.GET_VISUAL_ACTIONS,
                })
            );
        });

        it('should throw error when getVisualActions returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getVisualActions(TEST_GUID, TEST_GUID);
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve the visual actions');
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

        it('should emit SET_THEME event when setTheme is called', () => {
            dashboardExperience.setTheme(TEST_THEME_ARN);
            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.SET_THEME,
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

        it('should emit TOGGLE_EXECUTIVE_SUMMARY_PANE event when toggleExecutiveSummaryPane is called', () => {
            dashboardExperience.toggleExecutiveSummaryPane();
            expect(dashboardExperience.send).toHaveBeenCalledWith({
                eventName: MessageEventName.TOGGLE_EXECUTIVE_SUMMARY_PANE,
            });
        });

        it('should emit TOGGLE_BOOKMARKS_PANE event when toggleBookmarksPane is called', () => {
            dashboardExperience.toggleBookmarksPane();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.TOGGLE_BOOKMARKS_PANE,
            });
        });

        it('should emit TOGGLE_THRESHOLD_ALERTS_PANE event when toggleThresholdAlertsPane is called', () => {
            dashboardExperience.toggleThresholdAlertsPane();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.TOGGLE_THRESHOLD_ALERTS_PANE,
            });
        });

        it('should emit TOGGLE_SCHEDULING_PANE event when toggleSchedulingPane is called', () => {
            dashboardExperience.toggleSchedulingPane();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.TOGGLE_SCHEDULING_PANE,
            });
        });

        it('should emit TOGGLE_RECENT_SNAPSHOTS_PANE event when toggleRecentSnapshotsPane is called', () => {
            dashboardExperience.toggleRecentSnapshotsPane();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.TOGGLE_RECENT_SNAPSHOTS_PANE,
            });
        });

        it('should emit GET_PARAMETERS event when getParameters is called', async () => {
            mockSend.mockResolvedValue({message: []});

            const val = await dashboardExperience.getParameters();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_PARAMETERS,
            });
            expect(val).toEqual([]);
        });

        it('should throw error when getParameters returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getParameters();
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve the parameters');
        });

        it('should emit GET_SHEETS event when getSheets is called', async () => {
            mockSend.mockResolvedValue({message: []});

            const val = await dashboardExperience.getSheets();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_SHEETS,
            });
            expect(val).toEqual([]);
        });

        it('should throw error when getSheets returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getSheets();
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve the sheets');
        });

        it('should emit GET_SELECTED_SHEET_ID event when getSelectedSheetId is called', async () => {
            mockSend.mockResolvedValue({message: TEST_GUID});
            const val = await dashboardExperience.getSelectedSheetId();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_SELECTED_SHEET_ID,
            });
            expect(val).toEqual(TEST_GUID);
        });

        it('should throw error when getSelectedSheetId returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getSelectedSheetId();
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve the selected sheet id');
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
            mockSend.mockResolvedValue({message: []});

            const val = await dashboardExperience.getSheetVisuals(TEST_GUID);
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.GET_SHEET_VISUALS,
                message: {
                    SheetId: TEST_GUID,
                },
            });
            expect(val).toEqual([]);
        });

        it('should throw error when getSheetVisuals returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.getSheetVisuals(TEST_GUID);
            };

            await expect(wrapper).rejects.toThrowError('Failed to retrieve the sheet visuals');
        });

        it('should emit RESET event when reset is called', () => {
            dashboardExperience.reset();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.RESET,
            });
        });

        it('should emit SET_THEME_OVERRIDE event when setThemeOverride is called', () => {
            dashboardExperience.setThemeOverride({});

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.SET_THEME_OVERRIDE,
                })
            );
        });

        it('should emit CREATE_SHARED_VIEW event when createSharedView is called', async () => {
            const mockMessage = {success: true, dashboardId: '123', viewId: 'abc'};
            mockSend.mockResolvedValue({message: mockMessage});
            const val = await dashboardExperience.createSharedView();
            expect(dashboardExperience.send).toBeCalledWith({
                eventName: MessageEventName.CREATE_SHARED_VIEW,
            });
            expect(val).toEqual({message: mockMessage});
        });

        it('should throw error when createSharedView returns undefined message', async () => {
            mockSend.mockResolvedValue({});
            const wrapper = async () => {
                return await dashboardExperience.createSharedView();
            };

            await expect(wrapper).rejects.toThrowError('Failed to create shared view');
        });

        it('should emit PRELOAD_THEMES event when setPreloadThemes is called', () => {
            dashboardExperience.setPreloadThemes(['']);

            expect(dashboardExperience.send).toBeCalledWith(
                expect.objectContaining({
                    eventName: MessageEventName.PRELOAD_THEMES,
                })
            );
        });
    });
});
