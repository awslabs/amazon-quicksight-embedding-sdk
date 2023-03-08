import {ExperienceType} from '../../../src/enums';
import {isContextExperience, getContextExperienceIdentifier} from '../../../src/experiences/context';
import {InternalContextExperience, InternalDashboardExperience} from '../../../src/types';

describe('experiences: context', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';

    const TEST_CONSOLE_EXPERIENCE: InternalContextExperience = {
        experienceType: ExperienceType.CONTEXT,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    const TEST_DASHBOARD_EXPERIENCE: InternalDashboardExperience = {
        experienceType: ExperienceType.DASHBOARD,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        discriminator: 0,
    };

    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.CONTEXT}`;

    describe('isContextExperience', () => {
        it('should return true if experience is context', () => {
            const actual = isContextExperience(TEST_CONSOLE_EXPERIENCE);
            expect(actual).toEqual(true);
        });

        it('should return false if experience is not context', () => {
            const actual = isContextExperience(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(false);
        });
    });

    describe('getContextExperienceIdentifier', () => {
        it('should return experience identifier for context experience', () => {
            const actual = getContextExperienceIdentifier(TEST_CONSOLE_EXPERIENCE);
            expect(actual).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should not return experience identifier if not context experience', () => {
            const actual = getContextExperienceIdentifier(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(undefined);
        });
    });
});
