import {ExperienceType} from '../../../src/enums';
import {isQSearchExperience, getQSearchExperienceIdentifier, extractQSearchExperienceFromUrl} from '../../../src/experiences/qsearch';
import {InternalQSearchExperience, InternalDashboardExperience} from '../../../src/types';

describe('experiences: qsearch', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';

    const TEST_QSEARCH_EXPERIENCE: InternalQSearchExperience = {
        experienceType: ExperienceType.QSEARCH,
        contextId: TEST_CONTEXT_ID,
        discriminator: 0,
    };

    const TEST_DASHBOARD_EXPERIENCE: InternalDashboardExperience = {
        experienceType: ExperienceType.DASHBOARD,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        discriminator: 0,
    };

    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.QSEARCH}`;

    const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_QSEARCH_URL = 'https://test.amazon.com/embedding/guid/q/search';

    describe('extractQSearchExperienceFromUrl', () => {
        it('should return qsearch experience', () => {
            const actual = extractQSearchExperienceFromUrl(TEST_QSEARCH_URL);
            expect(actual).toEqual({
                experienceType: ExperienceType.QSEARCH,
            });
        });

        it('should not return if experience is not qsearch', () => {
            const actual = extractQSearchExperienceFromUrl(TEST_DASHBOARD_URL);
            expect(actual).toEqual(undefined);
        });
    });
    describe('isQSearchExperience', () => {
        it('should return true if experience is qsearch', () => {
            const actual = isQSearchExperience(TEST_QSEARCH_EXPERIENCE);
            expect(actual).toEqual(true);
        });

        it('should return false if experience is not qsearch', () => {
            const actual = isQSearchExperience(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(false);
        });
    });

    describe('getQSearchExperienceIdentifier', () => {
        it('should return experience identifier for qsearch experience', () => {
            const actual = getQSearchExperienceIdentifier(TEST_QSEARCH_EXPERIENCE);
            expect(actual).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should not return experience identifier if not qsearch experience', () => {
            const actual = getQSearchExperienceIdentifier(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(undefined);
        });
    });
});
