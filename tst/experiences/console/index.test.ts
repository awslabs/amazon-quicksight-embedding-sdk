import {ExperienceType} from '../../../src/enums';
import {isConsoleExperience, getConsoleExperienceIdentifier, extractConsoleExperienceFromUrl} from '../../../src/experiences/console';
import {InternalConsoleExperience, InternalDashboardExperience} from '../../../src/types';

describe('experiences: console', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';

    const TEST_CONSOLE_EXPERIENCE: InternalConsoleExperience = {
        experienceType: ExperienceType.CONSOLE,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    const TEST_DASHBOARD_EXPERIENCE: InternalDashboardExperience = {
        experienceType: ExperienceType.DASHBOARD,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        discriminator: 0,
    };

    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.CONSOLE}`;

    const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_CONSOLE_URL = 'https://test.amazon.com/embedding/guid/start';

    describe('extractConsoleExperienceFromUrl', () => {
        it('should return console experience', () => {
            const actual = extractConsoleExperienceFromUrl(TEST_CONSOLE_URL);
            expect(actual).toEqual({
                experienceType: ExperienceType.CONSOLE,
            });
        });

        it('should not return if experience is not console', () => {
            const actual = extractConsoleExperienceFromUrl(TEST_DASHBOARD_URL);
            expect(actual).toEqual(undefined);
        });
    });

    describe('isConsoleExperience', () => {
        it('should return true if experience is console', () => {
            const actual = isConsoleExperience(TEST_CONSOLE_EXPERIENCE);
            expect(actual).toEqual(true);
        });

        it('should return false if experience is not console', () => {
            const actual = isConsoleExperience(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(false);
        });
    });

    describe('getConsoleExperienceIdentifier', () => {
        it('should return experience identifier for console experience', () => {
            const actual = getConsoleExperienceIdentifier(TEST_CONSOLE_EXPERIENCE);
            expect(actual).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should not return experience identifier if not console experience', () => {
            const actual = getConsoleExperienceIdentifier(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(undefined);
        });
    });
});
