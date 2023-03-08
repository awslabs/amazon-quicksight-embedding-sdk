import {ExperienceType} from '../../../src/enums';
import {isDashboardExperience, getDashboardExperienceIdentifier, extractDashboardExperienceFromUrl} from '../../../src/experiences/dashboard';
import {InternalDashboardExperience, InternalVisualExperience} from '../../../src/types';

describe('experiences: dashboard', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_SHEET_ID = 'testSheetId';
    const TEST_VISUAL_ID = 'testVisualId';

    const TEST_DASHBOARD_EXPERIENCE: InternalDashboardExperience = {
        experienceType: ExperienceType.DASHBOARD,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        discriminator: 0,
    };

    const TEST_VISUAL_EXPERIENCE: InternalVisualExperience = {
        experienceType: ExperienceType.VISUAL,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        sheetId: TEST_SHEET_ID,
        visualId: TEST_VISUAL_ID,
        discriminator: 0,
    };

    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.DASHBOARD}-${TEST_DASHBOARD_ID}`;

    const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;
    const TEST_VISUAL_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}/sheets/${TEST_SHEET_ID}/visuals/${TEST_VISUAL_ID}`;

    describe('extractDashboardExperienceFromUrl', () => {
        it('should return dashboard experience', () => {
            const actual = extractDashboardExperienceFromUrl(TEST_DASHBOARD_URL);
            expect(actual).toEqual({
                experienceType: ExperienceType.DASHBOARD,
                dashboardId: TEST_DASHBOARD_ID,
            });
        });

        it('should not return if experience is not dashboard', () => {
            const actual = extractDashboardExperienceFromUrl(TEST_VISUAL_URL);
            expect(actual).toEqual(undefined);
        });
    });

    describe('isDashboardExperience', () => {
        it('should return true if experience is dashboard', () => {
            const actual = isDashboardExperience(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(true);
        });

        it('should return false if experience is not dashboard', () => {
            const actual = isDashboardExperience(TEST_VISUAL_EXPERIENCE);
            expect(actual).toEqual(false);
        });
    });

    describe('getDashboardExperienceIdentifier', () => {
        it('should return experience identifier for dashboard experience', () => {
            const actual = getDashboardExperienceIdentifier(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should not return experience identifier if not dashboard experience', () => {
            const actual = getDashboardExperienceIdentifier(TEST_VISUAL_EXPERIENCE);
            expect(actual).toEqual(undefined);
        });
    });
});
