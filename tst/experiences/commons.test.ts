import {ExperienceType} from '../../src/enums';
import {buildInternalExperienceInfo, getExperienceIdentifier} from '../../src/experiences/commons';
import {getDashboardExperienceIdentifier} from '../../src/experiences/dashboard';
import {getVisualExperienceIdentifier} from '../../src/experiences/visual';

describe('experiences commons', () => {
    const TEST_CONTEXT_ID = 'testContextId';
    const TEST_DASHBOARD_ID = 'testDashboardId';
    const TEST_SHEET_ID = 'testSheetId';
    const TEST_VISUAL_ID = 'testVisualId';
    const TEST_VISUAL_EXPERIENCE = {
        experienceType: ExperienceType.VISUAL,
        dashboardId: TEST_DASHBOARD_ID,
        sheetId: TEST_SHEET_ID,
        visualId: TEST_VISUAL_ID,
        contextId: TEST_CONTEXT_ID,
    };
    const TEST_EXPERIENCE_IDENTIFIER = `${TEST_CONTEXT_ID}-${ExperienceType.VISUAL}-${TEST_DASHBOARD_ID}-${TEST_SHEET_ID}-${TEST_VISUAL_ID}`;

    describe('getExperienceIdentifier', () => {
        it('should return experience identifier', () => {
            const experienceIdentifier = getExperienceIdentifier(TEST_VISUAL_EXPERIENCE);
            expect(experienceIdentifier).toEqual(TEST_EXPERIENCE_IDENTIFIER);
        });

        it('should return experience identifier with discriminator', () => {
            const experienceIdentifier = getExperienceIdentifier({
                experienceType: ExperienceType.VISUAL,
                dashboardId: TEST_DASHBOARD_ID,
                sheetId: TEST_SHEET_ID,
                visualId: TEST_VISUAL_ID,
                contextId: TEST_CONTEXT_ID,
                discriminator: 1,
            });
            expect(experienceIdentifier).toEqual(`${TEST_EXPERIENCE_IDENTIFIER}-1`);
        });

        it('should throw error if experience is undefined', () => {
            const getExperienceIdentifierWrapper = () => {
                getExperienceIdentifier(undefined);
            };
            expect(getExperienceIdentifierWrapper).toThrowError('No experience provided');
        });

        it('should throw error if not valid experience', () => {
            const getExperienceIdentifierWrapper = () => {
                getExperienceIdentifier({});
            };
            expect(getExperienceIdentifierWrapper).toThrowError('Cannot create experience identifier for the experience');
        });
    });

    describe('buildInternalExperienceInfo', () => {
        it('should return internal experience and experience identifier', () => {
            const {experienceIdentifier, internalExperience} = buildInternalExperienceInfo(
                TEST_VISUAL_EXPERIENCE,
                new Set(),
                TEST_CONTEXT_ID,
                getVisualExperienceIdentifier
            );
            expect(experienceIdentifier).toEqual(TEST_EXPERIENCE_IDENTIFIER);
            expect(internalExperience).toEqual({
                ...TEST_VISUAL_EXPERIENCE,
                contextId: TEST_CONTEXT_ID,
                discriminator: 0,
            });
        });

        it('should not return internal experience info if no experience', () => {
            const internalExperienceInfo = buildInternalExperienceInfo(undefined, new Set(), TEST_CONTEXT_ID, getVisualExperienceIdentifier);
            expect(internalExperienceInfo).toEqual(undefined);
        });

        it('should not return internal experience info if not valid experience', () => {
            const internalExperienceInfo = buildInternalExperienceInfo(undefined, new Set(), TEST_CONTEXT_ID, getDashboardExperienceIdentifier);
            expect(internalExperienceInfo).toEqual(undefined);
        });
    });
});
