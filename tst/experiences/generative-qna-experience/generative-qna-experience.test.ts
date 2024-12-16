import {ExperienceType, InternalExperiences} from '@experience/base-experience/types';
import {ChangeEventLevel, ChangeEventName, MessageEventName} from '@common/events/types';
import {ControlOptions} from '@experience/control-experience/types';
import {EventManager} from '@common/event-manager/event-manager';
import {GenerativeQnAExperience} from '@experience/generative-qna-experience/generative-qna-experience';
import {GenerativeQnAPanelType} from '@experience/generative-qna-experience/types';
import {InternalQBaseExperience} from '@experience/internal-q-base-experience/internal-q-base-experience';
import {ControlExperience} from '@experience/control-experience/control-experience';
import {SDK_VERSION} from '@experience/base-experience/frame/experience-frame';

describe('GenerativeQnAExperience', () => {
    let TEST_CONTAINER: HTMLElement;
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_GENERATIVE_QNA_URL = 'https://test.amazon.com/embedding/guid/q/search/nre';
    const TEST_OTHER_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_INTERNAL_EXPERIENCE: InternalExperiences = {
        experienceType: ExperienceType.GENERATIVEQNA,
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

    it('should create GenerativeQnA frame', () => {
        const frameOptions = {
            url: TEST_GENERATIVE_QNA_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const qSearchExperience = new GenerativeQnAExperience(
            frameOptions,
            {},
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
        expect(iFrame!.src).toEqual(
            `https://test.amazon.com/embedding/guid/q/search/nre?punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&contextId=testContextId&discriminator=0`
        );
    });

    it('should generate url from content options with FULL panel type', () => {
        const frameOptions = {
            url: `${TEST_GENERATIVE_QNA_URL}?test=test`,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        new GenerativeQnAExperience(
            frameOptions,
            {
                showTopicName: true,
                showPinboard: false,
                showSearchBar: true,
                showInterpretedAs: true,
                showFeedback: true,
                showGeneratedNarrative: true,
                showDidYouMean: true,
                showComplementaryVisuals: true,
                showQBusinessInsights: true,
                showSeeWhy: true,
                allowTopicSelection: true,
                allowFullscreen: true,
                allowReturn: true,
                searchPlaceholderText: 'custom search placeholder',
                panelOptions: {
                    panelType: GenerativeQnAPanelType.FULL,
                    title: 'custom title',
                    showQIcon: false,
                },
                themeOptions: {
                    themeArn: 'my-theme-arn',
                },
                initialQuestionId: 'mockQuestionId',
                initialAnswerId: 'mockAnswerId',
            },
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();
        expect(iFrame!.src).toEqual(
            `https://test.amazon.com/embedding/guid/q/search/nre?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&qShowTopicName=true&qShowPinboard=false&qShowSearchBar=true&qShowInterpretedAs=true&qShowFeedback=true&qShowGeneratedNarrative=true&qShowDidYouMean=true&qShowComplementaryVisuals=true&qShowQBusinessInsights=true&qShowSeeWhy=true&qAllowTopicSelection=true&qAllowFullscreen=true&qAllowReturn=true&questionId=mockQuestionId&answerId=mockAnswerId&qSearchPlaceholderText=custom%2520search%2520placeholder&qPanelType=FULL&qPanelTitle=custom%2520title&qShowPanelIcon=false&themeArn=my-theme-arn&contextId=testContextId&discriminator=0`
        );
    });

    it('should generate url from content options with SEARCH_BAR panel type', () => {
        const frameOptions = {
            url: `${TEST_GENERATIVE_QNA_URL}?test=test`,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        new GenerativeQnAExperience(
            frameOptions,
            {
                showTopicName: true,
                showPinboard: false,
                showSearchBar: false,
                showInterpretedAs: false,
                showFeedback: false,
                showGeneratedNarrative: false,
                showDidYouMean: false,
                showComplementaryVisuals: false,
                showQBusinessInsights: false,
                showSeeWhy: false,
                allowTopicSelection: true,
                allowFullscreen: true,
                allowReturn: false,
                searchPlaceholderText: 'custom search placeholder',
                panelOptions: {
                    panelType: GenerativeQnAPanelType.SEARCH_BAR,
                    focusedHeight: '100px',
                    expandedHeight: '300px',
                },
                themeOptions: {
                    themeArn: 'my-theme-arn',
                },
                initialQuestionId: 'mockQuestionId',
                initialAnswerId: 'mockAnswerId',
            },
            TEST_CONTROL_OPTIONS,
            new Set<string>()
        );

        const iFrame = TEST_CONTAINER.querySelector('iframe');
        expect(iFrame).toBeDefined();
        expect(iFrame!.src).toEqual(
            `https://test.amazon.com/embedding/guid/q/search/nre?test=test&punyCodeEmbedOrigin=http%3A%2F%2Flocalhost%2F-&sdkVersion=${SDK_VERSION}&qShowTopicName=true&qShowPinboard=false&qShowSearchBar=false&qShowInterpretedAs=false&qShowFeedback=false&qShowGeneratedNarrative=false&qShowDidYouMean=false&qShowComplementaryVisuals=false&qShowQBusinessInsights=false&qShowSeeWhy=false&qAllowTopicSelection=true&qAllowFullscreen=true&qAllowReturn=false&questionId=mockQuestionId&answerId=mockAnswerId&qSearchPlaceholderText=custom%2520search%2520placeholder&qPanelType=SEARCH_BAR&qPanelFocusedHeight=100px&qPanelExpandedHeight=300px&themeArn=my-theme-arn&contextId=testContextId&discriminator=0`
        );
    });

    it('should throw error if given invalid panel type', () => {
        const frameOptions = {
            url: TEST_GENERATIVE_QNA_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const contentOptions = {
            panelOptions: {
                panelType: 'non-panel-type',
            },
        };

        const createQSearchFrameWrapper = () => {
            new GenerativeQnAExperience(
                frameOptions,
                // @ts-expect-error - intentionally includes invalid value
                contentOptions,
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );
        };
        expect(createQSearchFrameWrapper).toThrowError(
            'panelOptions.panelType should be one of following: [FULL, SEARCH_BAR]'
        );
    });

    it('should throw if panel title exceeds max length', () => {
        const frameOptions = {
            url: TEST_GENERATIVE_QNA_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const contentOptions = {
            panelOptions: {
                panelType: GenerativeQnAPanelType.FULL,
                title: 't'.repeat(GenerativeQnAExperience.TEXT_PROPERTY_MAX_LENGTH + 1),
            },
        };

        const createQSearchFrameWrapper = () => {
            new GenerativeQnAExperience(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createQSearchFrameWrapper).toThrowError('panelOptions.title should be less than 200 characters');
    });

    it('should throw if search placeholder exceeds max length', () => {
        const frameOptions = {
            url: TEST_GENERATIVE_QNA_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };

        const contentOptions = {
            searchPlaceholderText: 's'.repeat(GenerativeQnAExperience.TEXT_PROPERTY_MAX_LENGTH + 1),
        };

        const createQSearchFrameWrapper = () => {
            new GenerativeQnAExperience(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createQSearchFrameWrapper).toThrowError('searchPlaceholderText should be less than 200 characters');
    });

    it('should throw error if no url', () => {
        const frameOptions = {
            url: undefined,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createQSearchFrameWrapper = () => {
            new GenerativeQnAExperience(
                // @ts-expect-error - should throw error when no url is passed
                frameOptions,
                {},
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );
        };
        expect(createQSearchFrameWrapper).toThrowError('Url is required for the experience');
    });

    it('should throw error if not GenerativeQnA url', () => {
        const frameOptions = {
            url: TEST_OTHER_URL,
            container: TEST_CONTAINER,
            width: '800px',
        };

        const createQSearchFrameWrapper = () => {
            new GenerativeQnAExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());
        };
        expect(createQSearchFrameWrapper).toThrowError('Invalid generative-qna experience URL');
    });

    it('should emit warning if with unrecognized content options', () => {
        const frameOptions = {
            url: TEST_GENERATIVE_QNA_URL,
            container: TEST_CONTAINER,
            width: '800px',
            onChange: onChangeSpy,
        };
        const contentOptions = {
            [TEST_UNRECOGNIZED_CONTENT_OPTION]: 'abc',
            panelOptions: {
                panelType: GenerativeQnAPanelType.FULL,
                [TEST_UNRECOGNIZED_CONTENT_OPTION]: 'def',
            },
        };

        new GenerativeQnAExperience(frameOptions, contentOptions, TEST_CONTROL_OPTIONS, new Set<string>());
        expect(onChangeSpy).toHaveBeenCalledWith(
            {
                eventName: ChangeEventName.UNRECOGNIZED_CONTENT_OPTIONS,
                eventLevel: ChangeEventLevel.WARN,
                message: 'Experience content options contain unrecognized properties',
                data: {
                    unrecognizedContentOptions: [
                        TEST_UNRECOGNIZED_CONTENT_OPTION,
                        `panelOptions.${TEST_UNRECOGNIZED_CONTENT_OPTION}`,
                    ],
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
                url: TEST_GENERATIVE_QNA_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            new GenerativeQnAExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            const iFrame = TEST_CONTAINER.querySelector('iframe');

            expect(iFrame?.height).toEqual('100%');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_SEARCH_OPENED,
                        message: {
                            height: '500px',
                        },
                    },
                })
            );

            expect(iFrame?.style.height).toEqual('500px');
        });

        it('should enter full screen mode when Q_PANEL_ENTERED_FULLSCREEN is emitted', () => {
            const frameOptions = {
                url: TEST_GENERATIVE_QNA_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            new GenerativeQnAExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            const iFrame = TEST_CONTAINER.querySelector('iframe');
            const enterAndTestFullScreen = (iframeProp: HTMLIFrameElement | null) => {
                expect(iframeProp?.style.zIndex).toEqual('');
                controlExperience.controlFrameMessageListener(
                    new MessageEvent('message', {
                        data: {
                            eventTarget: TEST_INTERNAL_EXPERIENCE,
                            eventName: MessageEventName.Q_PANEL_ENTERED_FULLSCREEN,
                        },
                    })
                );

                expect(iframeProp?.style.zIndex).toEqual(InternalQBaseExperience.MAX_Z_INDEX);
            };
            enterAndTestFullScreen(iFrame);
            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_PANEL_EXITED_FULLSCREEN,
                    },
                })
            );
            // test that going into fullscreen a second time works
            enterAndTestFullScreen(iFrame);
        });

        it('should exit full screen mode when Q_PANEL_EXITED_FULLSCREEN is emitted', () => {
            const frameOptions = {
                url: TEST_GENERATIVE_QNA_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            new GenerativeQnAExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

            const iFrame = TEST_CONTAINER.querySelector('iframe')!;

            // Set & confirm default value
            iFrame.style.zIndex = '10';
            expect(iFrame.style.zIndex).toEqual('10');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_PANEL_EXITED_FULLSCREEN,
                    },
                })
            );

            // Trigger exit first should not modify style
            expect(iFrame.style.zIndex).toEqual('10');

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_PANEL_ENTERED_FULLSCREEN,
                    },
                })
            );

            // Trigger fullscreen and verify z-index is set
            expect(iFrame.style.zIndex).toEqual(InternalQBaseExperience.MAX_Z_INDEX);

            controlExperience.controlFrameMessageListener(
                new MessageEvent('message', {
                    data: {
                        eventTarget: TEST_INTERNAL_EXPERIENCE,
                        eventName: MessageEventName.Q_PANEL_EXITED_FULLSCREEN,
                    },
                })
            );

            // Trigger exit & verify original zIndex
            expect(iFrame.style.zIndex).toEqual('10');
        });

        it('should configure click event listener when CONTENT_LOADED is emitted', () => {
            const frameOptions = {
                url: TEST_GENERATIVE_QNA_URL,
                container: TEST_CONTAINER,
                width: '800px',
                onChange: onChangeSpy,
            };

            const qSearchExperience = new GenerativeQnAExperience(
                frameOptions,
                {
                    panelOptions: {
                        panelType: GenerativeQnAPanelType.SEARCH_BAR,
                    },
                },
                TEST_CONTROL_OPTIONS,
                new Set<string>()
            );

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
        let qSearchExperience: GenerativeQnAExperience;
        const frameOptions = {
            url: TEST_GENERATIVE_QNA_URL,
            container: window.document.createElement('div'),
            width: '800px',
            onChange: onChangeSpy,
        };

        beforeEach(() => {
            qSearchExperience = new GenerativeQnAExperience(frameOptions, {}, TEST_CONTROL_OPTIONS, new Set<string>());

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
