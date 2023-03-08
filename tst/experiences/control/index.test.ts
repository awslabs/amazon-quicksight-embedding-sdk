import {ExperienceType} from '../../../src/enums';
import {isControlExperience, getControlExperienceIdentifier} from '../../../src/experiences/control';
import {InternalControlExperience, InternalDashboardExperience} from '../../../src/types';

describe('experiences: control', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';

    const TEST_CONTROL_EXPERIENCE: InternalControlExperience = {
        experienceType: ExperienceType.CONTROL,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    const TEST_DASHBOARD_EXPERIENCE: InternalDashboardExperience = {
        experienceType: ExperienceType.DASHBOARD,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        discriminator: 0,
    };

    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.CONTROL}`;

    describe('isControlExperience', () => {
        it('should return true if experience is control', () => {
            const actual = isControlExperience(TEST_CONTROL_EXPERIENCE);
            expect(actual).toEqual(true);
        });

        it('should return false if experience is not control', () => {
            const actual = isControlExperience(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(false);
        });
    });

    describe('getControlExperienceIdentifier', () => {
        it('should return experience identifier for control experience', () => {
            const actual = getControlExperienceIdentifier(TEST_CONTROL_EXPERIENCE);
            expect(actual).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should not return experience identifier if not control experience', () => {
            const actual = getControlExperienceIdentifier(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(undefined);
        });
    });
});
