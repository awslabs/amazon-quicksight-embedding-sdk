import {ExperienceType, InternalExperiences} from '@experience/base-experience/types';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '@common/events/types';
import {ControlOptions} from '@experience/control-experience/types';
import {EventManager} from '@common/event-manager/event-manager';
import {QSearchExperience} from '@experience/q-search-experience/q-search-experience';
import {ControlExperience} from '@experience/control-experience/control-experience';

describe('QSearchExperience', () => {
    let TEST_CONTAINER: HTMLElement;
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_QSEARCH_URL = 'https://test.amazon.com/embedding/guid/q/search';
    const TEST_OTHER_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_INTERNAL_EXPERIENCE: InternalExperiences = {
        experienceType: ExperienceType.QSEARCH,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };
    const TEST_UNRECOGNIZED_CONTENT_OPTION = 'testUnrecognizedContentOption';

    const onChangeSpy = jest.fn();

    let TEST_CONTROL_OPTIONS: ControlOptions;

    beforeEach(() => {
        const eventManager = new EventManager();

        TEST_CONTROL_OPTIONS = {
            eventManager,
            contextId: TEST_CONTEXT_ID,
            urlInfo: {
                sessionId: '1234',
                host: 'https://localhost.com',
            },
        };

        TEST_CONTAINER = window.document.createElement('div');
    });

    afterEach(() => {
        onChangeSpy.mockRestore();
    });

    it('should create q search frame', () => {
        const frameOptions = {
            url: TEST_QSEARCH_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const qSearchExperience = new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof qSearchExperience.send).toEqual('function');
        expect(typeof qSearchExperience.setQuestion).toEqual('function');
        expect(typeof qSearchExperience.close).toEqual('function');

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

    it('should create q search frame and handle existing query string on experience url', () => {
        const frameOptions = {
            url: `${TEST_QSEARCH_URL}?test=test`,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const qSearchExperience = new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(typeof qSearchExperience.send).toEqual('function');
        expect(typeof qSearchExperience.setQuestion).toEqual('function');
        expect(typeof qSearchExperience.close).toEqual('function');

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
            'https://test.amazon.com/embedding/guid/q/search?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&contextId=testContextId&discriminator=0'
        );
    });

    it('should set content options and maintain backwards compatability', () => {
        const frameOptions = {
            url: `${TEST_QSEARCH_URL}?test=test`,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const qSearchExperience = new QSearchExperience(
            frameOptions,
            {
                allowTopicSelection: true,
                hideIcon: true,
                hideTopicName: true,
                theme: 'theme:arn',
            },
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );
        expect(typeof qSearchExperience.send).toEqual('function');
        expect(typeof qSearchExperience.setQuestion).toEqual('function');
        expect(typeof qSearchExperience.close).toEqual('function');

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

        const url = new URL(iFrame?.src ?? '');

        expect(url.searchParams.has('qBarTopicNameDisabled')).toBeTruthy();
        expect(url.searchParams.has('allowTopicSelection')).toBeTruthy();
        expect(url.searchParams.has('qBarIconDisabled')).toBeTruthy();
        expect(url.searchParams.has('themeId')).toBeTruthy();
    });

    it('should throw error if no url', () => {
        const frameOptions = {
            url: undefined,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createQSearchFrameWrapper = () => {
            new QSearchExperience(
                // @ts-expect-error - should throw error when no url is passed
                frameOptions,
                {},
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );
        };
        expect(createQSearchFrameWrapper).toThrowError('Url is required for the experience');
    });

    it('should throw error if not q search url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createQSearchFrameWrapper = () => {
            new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createQSearchFrameWrapper).toThrowError('Invalid q-search experience URL');
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

        const qSearchExperience = new QSearchExperience(
            frameOptions,
            // @ts-expect-error should throw error when unrecognized content
            contentOptions,
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );
        expect(typeof qSearchExperience.send).toEqual('function');
        expect(typeof qSearchExperience.setQuestion).toEqual('function');
        expect(typeof qSearchExperience.close).toEqual('function');
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

        it('should resize iframe when Q_SEARCH_OPEN is emitted', () => {
            const frameOptions = {
                url: TEST_QSEARCH_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            const iFrame = TEST_CONTAINER.querySelector('iframe');

            expect(iFrame?.height).toEqual('0px');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_OPENED,
                        message: {
                            height: '500',
                        },
                    },
                })
            );

            expect(iFrame?.style.height).toEqual('500px');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_OPENED,
                        message: {},
                    },
                })
            );

            expect(iFrame?.style.height).toEqual('500px');
        });

        it('should enter full screen mode when Q_SEARCH_ENTERED_FULLSCREEN is emitted', () => {
            const frameOptions = {
                url: TEST_QSEARCH_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            const iFrame = TEST_CONTAINER.querySelector('iframe');

            expect(iFrame?.style.zIndex).toEqual('');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_ENTERED_FULLSCREEN,
                    },
                })
            );

            expect(iFrame?.style.zIndex).toEqual(QSearchExperience.MAX_Z_INDEX);
        });

        it('should exit full screen mode when Q_SEARCH_EXITED_FULLSCREEN is emitted', () => {
            const frameOptions = {
                url: TEST_QSEARCH_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            const iFrame = TEST_CONTAINER.querySelector('iframe');

            // Set & confirm default value
            iFrame!.style.zIndex = '10';
            expect(iFrame?.style.zIndex).toEqual('10');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_EXITED_FULLSCREEN,
                    },
                })
            );

            // Trigger exit first should not modify style
            expect(iFrame?.style.zIndex).toEqual('10');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_ENTERED_FULLSCREEN,
                    },
                })
            );

            // Trigger fullscreen and verify z-index is set
            expect(iFrame?.style.zIndex).toEqual(QSearchExperience.MAX_Z_INDEX);

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_EXITED_FULLSCREEN,
                    },
                })
            );

            // Trigger exit & verify original zIndex
            expect(iFrame?.style.zIndex).toEqual('10');
        });

        it('should configure click event listener when CONTENT_LOADED is emitted', () => {
            const frameOptions = {
                url: TEST_QSEARCH_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            const qSearchExperience = new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            jest.spyOn(qSearchExperience, 'send');

            const iFrame = TEST_CONTAINER.querySelector('iframe');

            expect(iFrame?.style.zIndex).toEqual('');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.CONTENT_LOADED,
                    },
                })
            );

            const event = new MouseEvent('click');

            Object.defineProperty(event, 'target', {
                writable: false,
                value: document.createElement('div'),
            });

            window.dispatchEvent(event);

            expect(qSearchExperience.send).toBeCalledWith({
                eventName: MessageEventName.CLOSE_Q_SEARCH,
            });
        });
    });

    describe('Actions', () => {
        let qSearchExperience: QSearchExperience;
        const frameOptions = {
            url: TEST_QSEARCH_URL,
            container: window.document.createElement('div'),
            width: '800px',
            onChange: onChangeSpy,
        };

        beforeEach(() => {
            qSearchExperience = new QSearchExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            jest.spyOn(qSearchExperience, 'send');
        });

        it('should emit CLOSE event when close is called', () => {
            qSearchExperience.close();

            expect(qSearchExperience.send).toBeCalledWith({
                eventName: MessageEventName.CLOSE_Q_SEARCH,
            });
        });

        it('should emit SET_QUEST event when setQuestion is called', () => {
            qSearchExperience.setQuestion('Test');

            expect(qSearchExperience.send).toBeCalledWith({
                eventName: MessageEventName.SET_Q_SEARCH_QUESTION,
                message: {
                    question: 'Test',
                },
            });
        });
    });
});
