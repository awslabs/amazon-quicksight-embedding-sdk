import {
    ContentOptions,
    Experiences,
    ExperienceType,
    FrameOptions,
    InternalExperiences,
    TransformedContentOptions,
} from '@experience/base-experience/types';
import {ControlOptions} from '@experience/control-experience/types';
import {EventListener} from '@common/event-manager/types';
import {MessageEventName} from '@common/events/types';
import {BaseExperienceFrame} from '@experience/base-experience/frame/experience-frame';
import {EventManager} from '@common/event-manager/event-manager';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {EmbeddingIFrameElement} from '@common/iframe/types';
jest.setTimeout(10000);

jest.mock('uuid', () => {
    return {
        __esModule: true,
        v4: () => '1234-1234',
    };
});

class TestExperienceFrame extends BaseExperienceFrame<ContentOptions, TransformedContentOptions, InternalExperiences> {
    public experience: Experiences;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public experienceFrame: any;
    public experienceId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public internalExperience: any;

    constructor(
        a: FrameOptions,
        b: ControlOptions,
        c: ContentOptions,
        d: TransformedContentOptions,
        e: InternalExperiences,
        f: string,
        g?: EventListener
    ) {
        super(a, b, c, d, e, f, g);

        this.experience = {
            experienceType: ExperienceType.CONTROL,
        };

        this.experienceId = '1234';
    }

    buildExperienceUrl = () => '';
}

describe('BaseExperience', () => {
    let TEST_CONTAINER: HTMLElement;
    beforeEach(() => {
        TEST_CONTAINER = window.document.createElement('div');
    });

    it('should throw error if frame has not been initialized yet', async () => {
        const testExperience = new TestExperienceFrame(
            {
                container: TEST_CONTAINER,
                url: 'https://localhost',
            },
            {
                contextId: '',
                eventManager: new EventManager(),
                urlInfo: {sessionId: '', host: ''},
            },
            {},
            {},
            {contextId: '1234', experienceType: ExperienceType.CONTROL},
            '1234'
        );
        await expect(
            testExperience.send({
                eventName: MessageEventName.SIZE_CHANGED,
                eventTarget: {
                    contextId: '1234',
                    experienceType: ExperienceType.CONTROL,
                },
            })
        ).rejects.toThrow('Cannot send SIZE_CHANGED: No experience frame found');
    });

    it('should throw error if frame url is not provided', () => {
        const wrapper = () => {
            new TestExperienceFrame(
                {
                    container: TEST_CONTAINER,
                    // @ts-expect-error should throw error when url is omitted
                    url: null,
                },
                {
                    contextId: '',
                    eventManager: new EventManager(),
                    urlInfo: {sessionId: '', host: ''},
                },
                {},
                {},
                {contextId: '1234', experienceType: ExperienceType.CONTROL},
                '1234'
            );
        };

        expect(wrapper).toThrowError('Url is required for the experience');
    });

    it('should return success response when event is acknowledge type', async () => {
        const testExperience = new TestExperienceFrame(
            {
                container: TEST_CONTAINER,
                url: 'https://localhost',
            },
            {
                contextId: '',
                eventManager: new EventManager(),
                urlInfo: {sessionId: '', host: ''},
            },
            {},
            {},
            {contextId: '1234', experienceType: ExperienceType.CONTROL},
            '1234'
        );

        const frame = window.document.createElement('iframe') as EmbeddingIFrameElement;

        const mockPostMessage = jest.fn();

        Object.defineProperty(frame, 'contentWindow', {
            writable: false,
            value: {
                postMessage: mockPostMessage,
            },
        });

        testExperience.iframe = frame;

        const acknowledge = await testExperience.send({
            eventName: MessageEventName.ACKNOWLEDGE,
            eventTarget: {
                contextId: '1234',
                experienceType: ExperienceType.CONTROL,
            },
        });

        expect(mockPostMessage).toBeCalled();

        expect(acknowledge).toEqual({success: true});
    });

    it('should throw error if experience type is invalid', async () => {
        const embedExperienceWrapper = async () => {
            // @ts-expect-error - should throw error
            BaseExperience.getExperienceIdentifier('BANANA');
        };
        await expect(embedExperienceWrapper).rejects.toThrow(
            'Invalid experience unable to build experience identifier'
        );
    });
});
