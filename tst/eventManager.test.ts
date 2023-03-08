import eventManagerBuilder from '../src/eventManager';

describe('eventManagerBuilder', () => {
    const TEST_EXPERIENCE_IDENTIFIER_1 = 'testExperienceIdentifier1';
    const TEST_EXPERIENCE_IDENTIFIER_2 = 'testExperienceIdentifier2';
    const TEST_DATA = 'testData';

    it('should expose expected methods', () => {
        const eventManager = eventManagerBuilder();
        expect(typeof eventManager.addEventListener).toEqual('function');
        expect(typeof eventManager.invokeEventListener).toEqual('function');
        expect(typeof eventManager.removeEventListener).toEqual('function');
        expect(typeof eventManager.experienceEventListenerBuilder).toEqual('function');
    });

    it('should add and invoke listeners', () => {
        const eventManager = eventManagerBuilder();
        const mockListener1 = jest.fn();
        const mockListener2 = jest.fn();
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener1);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_2, mockListener2);
        eventManager.invokeEventListener(TEST_EXPERIENCE_IDENTIFIER_1, TEST_DATA);
        expect(mockListener1).toHaveBeenCalledTimes(1);
        expect(mockListener2).toHaveBeenCalledTimes(0);
    });

    it('should remove listeners', () => {
        const eventManager = eventManagerBuilder();
        const mockListener1 = jest.fn();
        const mockListener2 = jest.fn();
        const mockListener3 = jest.fn();
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener1);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener2);
        eventManager.addEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener3);
        eventManager.removeEventListener(TEST_EXPERIENCE_IDENTIFIER_1, mockListener2);
        eventManager.invokeEventListener(TEST_EXPERIENCE_IDENTIFIER_1, TEST_DATA);
        expect(mockListener1).toHaveBeenCalledTimes(1);
        expect(mockListener2).toHaveBeenCalledTimes(0);
        expect(mockListener3).toHaveBeenCalledTimes(1);
    });

    it('should build experience event listener', () => {
        const mockListener1 = jest.fn();
        const eventManager = eventManagerBuilder();
        const experienceEventListener = eventManager.experienceEventListenerBuilder(TEST_EXPERIENCE_IDENTIFIER_1, mockListener1);
        expect(typeof experienceEventListener.addExperienceEventListener).toEqual('function');
        expect(typeof experienceEventListener.invokeExperienceEventListener).toEqual('function');
        expect(typeof experienceEventListener.removeExperienceEventListener).toEqual('function');
    });
});
