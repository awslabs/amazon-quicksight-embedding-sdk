import {ExperienceType} from '../../../src/enums';
import {isVisualExperience, getVisualExperienceIdentifier, extractVisualExperienceFromUrl} from '../../../src/experiences/visual';
import {InternalVisualExperience, InternalDashboardExperience} from '../../../src/types';

describe('experiences: visual', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_SHEET_ID = 'testSheetId';
    const TEST_VISUAL_ID = 'testVisualId';

    const TEST_VISUAL_EXPERIENCE: InternalVisualExperience = {
        experienceType: ExperienceType.VISUAL,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        sheetId: TEST_SHEET_ID,
        visualId: TEST_VISUAL_ID,
        discriminator: 0,
    };

    const TEST_DASHBOARD_EXPERIENCE: InternalDashboardExperience = {
        experienceType: ExperienceType.DASHBOARD,
        contextId: TEST_CONTEXT_ID,
        dashboardId: TEST_DASHBOARD_ID,
        discriminator: 0,
    };

    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.VISUAL}-${TEST_DASHBOARD_ID}-${TEST_SHEET_ID}-${TEST_VISUAL_ID}`;
    const TEST_VISUAL_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}/sheets/${TEST_SHEET_ID}/visuals/${TEST_VISUAL_ID}`;
    const TEST_DASHBOARD_URL = `https://test.amazon.com/embed/guid/dashboards/${TEST_DASHBOARD_ID}`;

    describe('extractVisualExperienceFromUrl', () => {
        it('should return visual experience', () => {
            const actual = extractVisualExperienceFromUrl(TEST_VISUAL_URL);
            expect(actual).toEqual({
                experienceType: ExperienceType.VISUAL,
                dashboardId: TEST_DASHBOARD_ID,
                sheetId: TEST_SHEET_ID,
                visualId: TEST_VISUAL_ID,
            });
        });

        it('should not return if experience is not visual', () => {
            const actual = extractVisualExperienceFromUrl(TEST_DASHBOARD_URL);
            expect(actual).toEqual(undefined);
        });
    });

    describe('isVisualExperience', () => {
        it('should return true if experience is visual', () => {
            const actual = isVisualExperience(TEST_VISUAL_EXPERIENCE);
            expect(actual).toEqual(true);
        });

        it('should return false if experience is not visual', () => {
            const actual = isVisualExperience(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(false);
        });
    });

    describe('getVisualExperienceIdentifier', () => {
        it('should return experience identifier for visual experience', () => {
            const actual = getVisualExperienceIdentifier(TEST_VISUAL_EXPERIENCE);
            expect(actual).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should not return experience identifier if not visual experience', () => {
            const actual = getVisualExperienceIdentifier(TEST_DASHBOARD_EXPERIENCE);
            expect(actual).toEqual(undefined);
        });
    });
});
