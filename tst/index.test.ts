import {createEmbeddingContext} from '../src';
import {ChangeEventLevel, ChangeEventName} from '../src/common/events';
import {EventListener} from '../src/common/event-manager';

const mockAddEventListener = jest.fn();

jest.mock('uuid', () => {
    return {
        __esModule: true,
        v4: () => '1234-1234',
    };
});

jest.mock('@common/event-manager/event-manager', () => {
    const {EventManager} = jest.requireActual<typeof import('@common/event-manager/event-manager')>(
        '@common/event-manager/event-manager'
    );

    const eventManager = new EventManager();

    class MockEventListener {
        addEventListener = (experienceId: string, listener: EventListener, cleanup?: boolean) => {
            eventManager.addEventListener(experienceId, listener, cleanup);
            mockAddEventListener(experienceId, listener, cleanup);
        };

        removeEventListener = eventManager.removeEventListener;

        cleanUpCallbacksForExperience = eventManager.cleanUpCallbacksForExperience;

        addEventListenerForCleanup = eventManager.addEventListenerForCleanup;
    }

    return {
        __esModule: true,
        EventManager: MockEventListener,
    };
});

describe('EmbeddingContext', () => {
    it('should create the embedding context', async () => {
        const embeddingContext = await createEmbeddingContext();
        expect(typeof embeddingContext.embedDashboard).toEqual('function');
        expect(typeof embeddingContext.embedVisual).toEqual('function');
        expect(typeof embeddingContext.embedConsole).toEqual('function');
        expect(typeof embeddingContext.embedQSearchBar).toEqual('function');
    });

    describe('embedDashboard', () => {
        let TEST_CONTAINER: HTMLElement;
        const TEST_DASHBOARD_ID = 'testDashboardId';
        const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}?authcode=1234`;

        beforeEach(() => {
            TEST_CONTAINER = window.document.createElement('div');
            mockAddEventListener.mockClear();
        });

        it('should successfully create embedded dashboard', async () => {
            const embeddingContext = await createEmbeddingContext();
            await embeddingContext.embedDashboard({
                url: TEST_DASHBOARD_URL,
                container: TEST_CONTAINER,
            });

            const iFrame = TEST_CONTAINER.querySelector('iframe');
            expect(iFrame).toBeDefined();

            expect(mockAddEventListener).toBeCalledTimes(2);

            expect(mockAddEventListener).toHaveBeenNthCalledWith(1, '1234-1234-CONTROL', expect.any(Function), true);
            expect(mockAddEventListener).toHaveBeenNthCalledWith(
                2,
                `1234-1234-DASHBOARD-${TEST_DASHBOARD_ID}`,
                expect.any(Function),
                true
            );
        });

        it('should throw error if frameOptions is not provided for embedDashboard method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedDashboard(true);
            };
            await expect(embedExperienceWrapper).rejects.toThrow(
                'embedDashboard is called with non-object frameOptions'
            );
        });

        it('should throw error if invalid frameOptions is provided for embedDashboard method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedDashboard(5);
            };
            await expect(embedExperienceWrapper).rejects.toThrow(
                'embedDashboard is called with non-object frameOptions'
            );
        });

        it('should throw error if frameOptions is missing', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedDashboard({
                    container: TEST_CONTAINER,
                });
            };
            await expect(embedExperienceWrapper).rejects.toThrow(
                'URL is missing in frame options, but is a required field'
            );
        });

        it('should throw error if body element is missing in DOM', async () => {
            const mockContextOnChange = jest.fn();
            jest.spyOn(document, 'getElementsByTagName').mockImplementation(
                // @ts-expect-error - Stubbing method to generate error
                () => []
            );
            const embeddingContext = await createEmbeddingContext({
                onChange: mockContextOnChange,
            });
            const embedExperienceWrapper = async () => {
                return await embeddingContext.embedDashboard({
                    container: TEST_CONTAINER,
                    url: TEST_DASHBOARD_URL,
                });
            };
            await expect(embedExperienceWrapper).rejects.toThrow('could not locate <body> element in the page');

            expect(mockContextOnChange).toBeCalledWith(
                {
                    eventLevel: ChangeEventLevel.ERROR,
                    eventName: ChangeEventName.NO_BODY,
                    message: 'could not locate <body> element in the page',
                },
                {frame: null}
            );

            jest.restoreAllMocks();
        });

        it('should throw error if control url is invalid', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                return await embeddingContext.embedDashboard({
                    container: TEST_CONTAINER,
                    url: `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`,
                });
            };
            await expect(embedExperienceWrapper).rejects.toThrow(
                'Invalid embedding url: "https://test.amazon.com/embed/guid/dashboards/testDashboardId"'
            );
        });

        it('should emit warning if frameOptions contains unrecognized properties', async () => {
            const onChangeSpy = jest.fn();
            const embeddingContext = await createEmbeddingContext();

            await embeddingContext.embedDashboard({
                url: TEST_DASHBOARD_URL,
                container: TEST_CONTAINER,
                // @ts-expect-error - should throw error when frameOption is invalid
                banana: '1234',
                onChange: onChangeSpy,
            });

            expect(onChangeSpy).toHaveBeenNthCalledWith(
                1,
                {
                    eventLevel: ChangeEventLevel.WARN,
                    eventName: ChangeEventName.UNRECOGNIZED_FRAME_OPTIONS,
                    message: 'embedDashboard is called with unrecognized properties',
                    data: {
                        unrecognizedFrameOptions: ['banana'],
                    },
                },
                {frame: null}
            );
        });
    });

    describe('embedVisual', () => {
        let TEST_CONTAINER: HTMLElement;
        let TEST_CONTAINER2: HTMLElement;
        const TEST_DASHBOARD_ID = 'testDashboardId';
        const TEST_SHEET_ID = 'testSheetId';
        const TEST_VISUAL_ID = 'testVisualId';
        const TEST_VISUAL_ID2 = 'testVisualId2';
        const TEST_VISUAL_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}/sheets/${TEST_SHEET_ID}/visuals/${TEST_VISUAL_ID}?`;
        const TEST_VISUAL_URL2 = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}/sheets/${TEST_SHEET_ID}/visuals/${TEST_VISUAL_ID2}`;

        beforeEach(() => {
            TEST_CONTAINER = window.document.createElement('div');
            mockAddEventListener.mockClear();
        });

        it('should successfully create embedded visual', async () => {
            const embeddingContext = await createEmbeddingContext();
            await embeddingContext.embedVisual({
                url: TEST_VISUAL_URL,
                container: TEST_CONTAINER,
            });

            const iFrame = TEST_CONTAINER.querySelector('iframe');
            expect(iFrame).toBeDefined();

            expect(mockAddEventListener).toBeCalledTimes(2);

            expect(mockAddEventListener).toHaveBeenNthCalledWith(1, '1234-1234-CONTROL', expect.any(Function), true);
            expect(mockAddEventListener).toHaveBeenNthCalledWith(
                2,
                `1234-1234-VISUAL-${TEST_DASHBOARD_ID}-${TEST_SHEET_ID}-${TEST_VISUAL_ID}`,
                expect.any(Function),
                true
            );
        });

        it('should successfully embed multiple visuals', async () => {
            TEST_CONTAINER2 = window.document.createElement('div');
            const embeddingContext = await createEmbeddingContext();
            await embeddingContext.embedVisual({
                url: TEST_VISUAL_URL,
                container: TEST_CONTAINER,
            });

            const iFrame = TEST_CONTAINER.querySelector('iframe');
            expect(iFrame).toBeDefined();

            expect(mockAddEventListener).toBeCalledTimes(2);

            expect(mockAddEventListener).toHaveBeenNthCalledWith(1, '1234-1234-CONTROL', expect.any(Function), true);
            expect(mockAddEventListener).toHaveBeenNthCalledWith(
                2,
                `1234-1234-VISUAL-${TEST_DASHBOARD_ID}-${TEST_SHEET_ID}-${TEST_VISUAL_ID}`,
                expect.any(Function),
                true
            );

            mockAddEventListener.mockClear();

            await embeddingContext.embedVisual({
                url: TEST_VISUAL_URL2,
                container: TEST_CONTAINER2,
            });

            expect(mockAddEventListener).toBeCalledTimes(1);

            expect(mockAddEventListener).toHaveBeenNthCalledWith(
                1,
                `1234-1234-VISUAL-${TEST_DASHBOARD_ID}-${TEST_SHEET_ID}-${TEST_VISUAL_ID2}`,
                expect.any(Function),
                true
            );
        });

        it('should throw error if frameOptions is not provided for embedVisual method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedVisual(undefined);
            };
            await expect(embedExperienceWrapper).rejects.toThrow('embedVisual is called without frameOptions');
        });

        it('should throw error if invalid frameOptions is provided for embedVisual method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedVisual([]);
            };
            await expect(embedExperienceWrapper).rejects.toThrow('embedVisual is called with non-object frameOptions');
        });
    });

    describe('embedConsole', () => {
        let TEST_CONTAINER: HTMLElement;
        const TEST_CONSOLE_URL = 'https://test.amazon.com/embedding/guid/start/favorites?';

        beforeEach(() => {
            TEST_CONTAINER = window.document.createElement('div');
            mockAddEventListener.mockClear();
        });

        it('should successfully create embedded console', async () => {
            const embeddingContext = await createEmbeddingContext();
            await embeddingContext.embedConsole({
                url: TEST_CONSOLE_URL,
                container: TEST_CONTAINER,
            });

            const iFrame = TEST_CONTAINER.querySelector('iframe');
            expect(iFrame).toBeDefined();

            expect(mockAddEventListener).toBeCalledTimes(2);

            expect(mockAddEventListener).toHaveBeenNthCalledWith(1, '1234-1234-CONTROL', expect.any(Function), true);
            expect(mockAddEventListener).toHaveBeenNthCalledWith(2, '1234-1234-CONSOLE', expect.any(Function), true);
        });

        it('should throw error if frameOptions is not provided for embedConsole method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedConsole(undefined);
            };
            await expect(embedExperienceWrapper).rejects.toThrow('embedConsole is called without frameOptions');
        });

        it('should throw error if invalid frameOptions is provided for embedConsole method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedConsole('5');
            };
            await expect(embedExperienceWrapper).rejects.toThrow('embedConsole is called with non-object frameOptions');
        });
    });

    describe('embedQSearchBar', () => {
        let TEST_CONTAINER: HTMLElement;
        const TEST_QSEARCH_URL = 'https://test.amazon.com/embedding/guid/q/search?';

        beforeEach(() => {
            TEST_CONTAINER = window.document.createElement('div');
            mockAddEventListener.mockClear();
        });

        it('should successfully create embedded q-search bar', async () => {
            const embeddingContext = await createEmbeddingContext();
            await embeddingContext.embedQSearchBar({
                url: TEST_QSEARCH_URL,
                container: TEST_CONTAINER,
            });

            const iFrame = TEST_CONTAINER.querySelector('iframe');
            expect(iFrame).toBeDefined();

            expect(mockAddEventListener).toBeCalledTimes(2);

            expect(mockAddEventListener).toHaveBeenNthCalledWith(1, '1234-1234-CONTROL', expect.any(Function), true);
            expect(mockAddEventListener).toHaveBeenNthCalledWith(2, '1234-1234-QSEARCH', expect.any(Function), true);
        });

        it('should throw error if frameOptions is not provided for embedQSearchBar method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedQSearchBar(undefined);
            };
            await expect(embedExperienceWrapper).rejects.toThrow('embedQSearchBar is called without frameOptions');
        });

        it('should throw error if invalid frameOptions is provided for embedQSearchBar method', async () => {
            const embeddingContext = await createEmbeddingContext();
            const embedExperienceWrapper = async () => {
                // @ts-expect-error - should throw error when frameOption is invalid
                return await embeddingContext.embedQSearchBar(true);
            };
            await expect(embedExperienceWrapper).rejects.toThrow(
                'embedQSearchBar is called with non-object frameOptions'
            );
        });
    });
});
