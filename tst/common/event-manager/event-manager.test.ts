import {EventManager} from '@common/event-manager/event-manager';
import {ExperienceType} from '@experience/base-experience/types';
import {InfoMessageEventName} from '@common/events/messages';
import {MessageEventName} from '@common/events/types';

describe('EventManager', () => {
    const TEST_EXPERIENCE_IDENTIFIER_1 = 'testExperienceIdentifier1';
    const TEST_EXPERIENCE_IDENTIFIER_2 = 'testExperienceIdentifier2';

    it('should expose expected methods', () => {
        const eventManager = new EventManager();
        expect(typeof eventManager.addEventListener).toEqual('function');
        expect(typeof eventManager.invokeEventListener).toEqual('function');
        expect(typeof eventManager.removeEventListener).toEqual('function');
    });

    it('should add and invoke listeners', () => {
        const eventManager = new EventManager();
        const mockListener1 = jest.fn();
        const mockListener2 = jest.fn();
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener1, true);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_2, mockListener2);
        eventManager.invokeEventListener(TEST_EXPERIENCE_IDENTIFIER_1, {
            eventTarget: {
                experienceType: ExperienceType.CONTROL,
                contextId: '',
            },
            message: {},
            eventName: InfoMessageEventName.EXPERIENCE_INITIALIZED,
        });
        expect(mockListener1).toHaveBeenCalledTimes(1);
        expect(mockListener2).toHaveBeenCalledTimes(0);
    });

    it('should remove listeners', () => {
        const eventManager = new EventManager();
        const mockListener1 = jest.fn();
        const mockListener2 = jest.fn();
        const mockListener3 = jest.fn();
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener1);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener2);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener3);
        eventManager.removeEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener2);
        eventManager.invokeEventListener(TEST_EXPERIENCE_IDENTIFIER_1, {
            eventTarget: {
                experienceType: ExperienceType.CONTROL,
                contextId: '',
            },
            message: {},
            eventName: InfoMessageEventName.EXPERIENCE_INITIALIZED,
        });
        expect(mockListener1).toHaveBeenCalledTimes(1);
        expect(mockListener2).toHaveBeenCalledTimes(0);
        expect(mockListener3).toHaveBeenCalledTimes(1);
    });

    it('should clean up listeners', () => {
        const eventManager = new EventManager();
        jest.spyOn(eventManager, 'removeEventListener');
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, jest.fn(), true);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, jest.fn(), true);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, jest.fn(), true);
        eventManager.cleanUpCallbacksForExperience(TEST_EXPERIENCE_IDENTIFIER_1);

        expect(eventManager.removeEventListener).toBeCalledTimes(3);
        expect(eventManager.removeEventListener).toHaveBeenNthCalledWith(
            1,
            TEST_EXPERIENCE_IDENTIFIER_1,
            expect.any(Function)
        );
    });

    it('should not clean up listeners if no callbacks have been registered for cleanup', () => {
        const eventManager = new EventManager();
        jest.spyOn(eventManager, 'removeEventListener');
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, jest.fn());
        eventManager.cleanUpCallbacksForExperience(TEST_EXPERIENCE_IDENTIFIER_1);

        expect(eventManager.removeEventListener).toBeCalledTimes(0);
    });

    it('addEventListener should throw error when experienceId is not provided', () => {
        const eventManager = new EventManager();
        const mockListener1 = jest.fn();

        expect(() => {
            // @ts-expect-error should throw error because of invalid type
            eventManager.addEventListener(null, mockListener1);
        }).toThrow('Experience identifier is required when calling addEventListener');
    });

    it('addEventListener should throw error when listener is not function', () => {
        const eventManager = new EventManager();

        expect(() => {
            // @ts-expect-error should throw error because of invalid type
            eventManager.addEventListener('test', {});
        }).toThrow('Invalid type provided for event listener');
    });

    it('invokeEventListener should throw error when experience cannot be found', () => {
        const eventManager = new EventManager();

        expect(() => {
            eventManager.invokeEventListener('test', {
                eventName: MessageEventName.SIZE_CHANGED,
            });
        }).toThrow('Unable to find experience specific event listeners: test');
    });

    it('removeEventListener should throw error when experience cannot be found', () => {
        const eventManager = new EventManager();

        expect(() => {
            // @ts-expect-error should throw error because of invalid type
            eventManager.removeEventListener('test', {});
        }).toThrow('Unable to find experience specific event listeners: test');
    });
});
