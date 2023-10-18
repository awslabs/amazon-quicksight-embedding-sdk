import {
    ContentOptions,
    Experiences,
    ExperienceType,
    FrameOptions,
    InternalExperiences,
    TransformedContentOptions,
} from '@experience/base-experience/types';
import {MessageEventName} from '@common/events/types';
import {ConsoleContentOptions} from '@experience/console-experience/types';
import {ControlOptions, IControlExperience} from '@experience/control-experience/types';
import {EventManager} from '@common/event-manager/event-manager';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {BaseExperienceFrame} from '@experience/base-experience/frame/experience-frame';

const mockAddInternalEventListener = jest.fn();

class TestExperience extends BaseExperience<
    ContentOptions,
    InternalExperiences,
    Experiences,
    TransformedContentOptions,
    BaseExperienceFrame<ContentOptions, TransformedContentOptions, InternalExperiences>
> {
    public experience: Experiences;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public experienceFrame: any;
    public experienceId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public internalExperience: any;

    constructor(a: FrameOptions, b: ConsoleContentOptions, c: ControlOptions, d: Set<string>) {
        super(a, b, c, d);

        this.experience = {
            experienceType: ExperienceType.CONTROL,
        };

        this.experienceId = '1234';

        this.experienceFrame = {
            addInternalEventListener: mockAddInternalEventListener,
        };
    }

    buildExperienceUrl = () => '';

    extractExperienceFromUrl = (): IControlExperience => {
        return {
            experienceType: ExperienceType.CONTROL,
            discriminator: 0,
        };
    };
}

describe('BaseExperience', () => {
    it('should throw error if url is not provided', async () => {
        const embedExperienceWrapper = async () => {
            new TestExperience(
                {
                    // @ts-expect-error - should throw error
                    url: null,
                    container: window.document.createElement('div'),
                },
                {},
                {},
                new Set()
            );
        };
        await expect(embedExperienceWrapper).rejects.toThrow('Url is required for the experience');
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

    it('Should throw error when send is called before URL has been set', async () => {
        const testExperience = new TestExperience(
            {
                url: 'https://localhost.com',
                container: window.document.createElement('div'),
            },
            {},
            {
                contextId: '1',
                urlInfo: {
                    sessionId: '',
                    host: '',
                },
                eventManager: new EventManager(),
            },
            new Set()
        );

        expect(await testExperience.send).rejects.toThrow('Experience has not been initialized');
    });

    it('Should call addInternalEventListener on experience frame when addEventListener is called', () => {
        const testExperience = new TestExperience(
            {
                url: 'https://localhost:8000',
                container: window.document.createElement('div'),
            },
            {},
            {
                contextId: '1',
                urlInfo: {
                    sessionId: '',
                    host: '',
                },
                eventManager: new EventManager(),
            },
            new Set()
        );

        const mockEventListener = jest.fn();

        testExperience.addEventListener(MessageEventName.RESET, mockEventListener);

        expect(mockAddInternalEventListener).toBeCalledWith(MessageEventName.RESET, mockEventListener);
    });
});
