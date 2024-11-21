import {ExperienceType} from '@experience/base-experience/types';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '@common/events/types';
import {EventManager} from '@common/event-manager/event-manager';
import {ConsoleExperience} from '@experience/console-experience/console-experience';
import {SDK_VERSION} from '@experience/base-experience/frame/experience-frame';
import {InfoMessageEventName} from '@common/events/messages';

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
        expect(typeof consoleExperience.createSharedView).toEqual('function');
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
            `https://test.amazon.com/embedding/guid/start/favorites?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&contextId=testContextId&discriminator=0`
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

    describe('Actions', () => {
        let consoleExperience: ConsoleExperience;
        const mockSend = jest.fn();
        let TEST_CONTAINER: HTMLElement;

        beforeEach(() => {
            TEST_CONTAINER = window.document.createElement('div');
            const frameOptions = {
                url: TEST_CONSOLE_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            const contentOptions = {
                toolbarOptions: {
                    executiveSummary: true,
                    dataQnA: true,
                },
            };

            consoleExperience = new ConsoleExperience(
                frameOptions,
                contentOptions,
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );
            jest.spyOn(consoleExperience, 'send').mockImplementation(mockSend);
        });

        describe('createSharedView', () => {
            it('should not emit CREATE_SHARED_VIEW event when createSharedView is called on default page', () => {
                const wrapper = async () => {
                    return await consoleExperience.createSharedView();
                };

                expect(wrapper).rejects.toThrowError('Cannot call createSharedView from this page');
            });

            it('should not emit CREATE_SHARED_VIEW event when page is anything but DASHBOARD or DASHBOARD_SHEET', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'FOLDERS'},
                });
                const wrapper = async () => {
                    return await consoleExperience.createSharedView();
                };

                expect(wrapper).rejects.toThrowError('Cannot call createSharedView from this page');
            });

            it('should throw error when createSharedView returns undefined message', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'DASHBOARD'},
                });
                mockSend.mockResolvedValue({});
                const wrapper = async () => {
                    return await consoleExperience.createSharedView();
                };

                await expect(wrapper).rejects.toThrowError('Failed to create shared view');
            });

            it('should call createSharedView if we are on the DASHBOARD page', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'DASHBOARD'},
                });
                const mockMessage = {success: true, dashboardId: '123', viewId: 'abc'};
                mockSend.mockResolvedValue({message: mockMessage});

                consoleExperience.createSharedView();
                expect(consoleExperience.send).toBeCalledWith(
                    expect.objectContaining({
                        eventName: MessageEventName.CREATE_SHARED_VIEW,
                    })
                );
            });

            it('should call createSharedView if we are on the DASHBOARD_SHEET page', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'DASHBOARD_SHEET'},
                });
                const mockMessage = {success: true, dashboardId: '123', viewId: 'abc'};
                mockSend.mockResolvedValue({message: mockMessage});

                consoleExperience.createSharedView();
                expect(consoleExperience.send).toBeCalledWith(
                    expect.objectContaining({
                        eventName: MessageEventName.CREATE_SHARED_VIEW,
                    })
                );
            });

            it('should call createSharedView if we are on the DASHBOARD_VIEW page', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'DASHBOARD_VIEW'},
                });
                const mockMessage = {success: true, dashboardId: '123', viewId: 'abc'};
                mockSend.mockResolvedValue({message: mockMessage});

                consoleExperience.createSharedView();
                expect(consoleExperience.send).toBeCalledWith(
                    expect.objectContaining({
                        eventName: MessageEventName.CREATE_SHARED_VIEW,
                    })
                );
            });
        });

        describe('toggleExecutiveSummaryPane', () => {
            it('should not emit TOGGLE_EXECUTIVE_SUMMARY_PANE event when toggleExecutiveSummaryPane is called on default page', () => {
                const wrapper = async () => {
                    return await consoleExperience.toggleExecutiveSummaryPane();
                };

                expect(wrapper).rejects.toThrowError('Cannot call toggleExecutiveSummaryPane from this page');
            });

            it('should not emit TOGGLE_EXECUTIVE_SUMMARY_PANE event when page is anything but DASHBOARD', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'FOLDERS'},
                });
                const wrapper = async () => {
                    return await consoleExperience.toggleExecutiveSummaryPane();
                };

                expect(wrapper).rejects.toThrowError('Cannot call toggleExecutiveSummaryPane from this page');
            });

            it('should call toggleExecutiveSummaryPane if we are on the DASHBOARD page', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'DASHBOARD'},
                });
                const mockMessage = {success: true, dashboardId: '123', viewId: 'abc'};
                mockSend.mockResolvedValue({message: mockMessage});

                consoleExperience.toggleExecutiveSummaryPane();
                expect(consoleExperience.send).toBeCalledWith(
                    expect.objectContaining({
                        eventName: MessageEventName.TOGGLE_EXECUTIVE_SUMMARY_PANE,
                    })
                );
            });
        });

        describe('openDataQnAPane', () => {
            it('should call openDataQnAPane if we are on the DASHBOARD page', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'DASHBOARD'},
                });
                const mockMessage = {success: true};
                mockSend.mockResolvedValue({message: mockMessage});

                consoleExperience.openDataQnAPane();
                expect(consoleExperience.send).toBeCalledWith(
                    expect.objectContaining({
                        eventName: MessageEventName.OPEN_DATA_QNA_PANE,
                    })
                );
            });
        });

        describe('openBuildVisualPane', () => {
            it('should call openBuildVisualPane if we are on the ANALYSIS page', async () => {
                (consoleExperience as any).interceptMessage({
                    eventName: InfoMessageEventName.PAGE_NAVIGATION,
                    message: {pageType: 'ANALYSIS'},
                });
                const mockMessage = {success: true};
                mockSend.mockResolvedValue({message: mockMessage});

                consoleExperience.openBuildVisualPane();
                expect(consoleExperience.send).toBeCalledWith(
                    expect.objectContaining({
                        eventName: MessageEventName.OPEN_BUILD_VISUAL_PANE,
                    })
                );
            });
        });
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
