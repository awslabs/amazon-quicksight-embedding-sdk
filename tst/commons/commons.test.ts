import {buildExperienceUrl, getUrlInfo} from '../../src/commons';

describe('commons', () => {
    const TEST_HOST = 'https://test.amazon.com';
    const TEST_GUID = 'testGuid';
    const TEST_BASE_URL = new URL(`${TEST_HOST}/embed/${TEST_GUID}/dashboards/dashboardId`);
    const TEST_ALPHA_VALUE = 5;
    const TEST_BETA_VALUE = 'six';
    const TEST_PARAMETERS = {
        gamma: 7,
        delta: 'eight',
    };
    const TEST_OTHER_OPTIONS = {
        alpha: TEST_ALPHA_VALUE,
        beta: TEST_BETA_VALUE,
    };
    const TEST_QUERY_STRING = `&alpha=${TEST_ALPHA_VALUE}&beta=${TEST_BETA_VALUE}`;

    describe('buildExperienceUrl', () => {
        it('should create experience url with parameters', () => {
            const contentOptions = {
                parameters: TEST_PARAMETERS,
            };
            const experienceUrl = buildExperienceUrl(TEST_BASE_URL, contentOptions, {});
            expect(experienceUrl.startsWith(TEST_BASE_URL.toString())).toEqual(true);
            expect(experienceUrl.endsWith('#p.gamma=7&p.delta=eight')).toEqual(true);
        });

        it('should create experience url with queryString and parameters', () => {
            const contentOptions = {
                parameters: TEST_PARAMETERS,
                ...TEST_OTHER_OPTIONS,
            };
            const experienceUrl = buildExperienceUrl(TEST_BASE_URL, contentOptions, {});
            expect(experienceUrl.startsWith(TEST_BASE_URL.toString())).toEqual(true);
            expect(experienceUrl.endsWith('#p.gamma=7&p.delta=eight')).toEqual(true);
            expect(experienceUrl.includes(TEST_QUERY_STRING)).toEqual(true);
        });

        it('should create experience url without parameters', () => {
            const contentOptions = {
                ...TEST_OTHER_OPTIONS,
            };
            const experienceUrl = buildExperienceUrl(TEST_BASE_URL, contentOptions, {});
            expect(experienceUrl.startsWith(TEST_BASE_URL.toString())).toEqual(true);
            expect(experienceUrl.includes('#')).toEqual(false);
            expect(experienceUrl.includes(TEST_QUERY_STRING)).toEqual(true);
        });
    });

    describe('getUrlInfo', () => {
        it('should create url info', () => {
            const contentOptions = {
                parameters: TEST_PARAMETERS,
                ...TEST_OTHER_OPTIONS,
            };
            const experienceUrl = buildExperienceUrl(TEST_BASE_URL, contentOptions, {});
            const urlInfo = getUrlInfo(experienceUrl);
            expect(urlInfo.host).toEqual(TEST_HOST);
            expect(urlInfo.guid).toEqual(TEST_GUID);
            expect(urlInfo.urlSearchParams.get('alpha')).toEqual(TEST_ALPHA_VALUE.toString());
            expect(urlInfo.urlSearchParams.get('beta')).toEqual(TEST_BETA_VALUE);
        });

        it('should not create url info if url does not contain embed', () => {
            const testUrl = `${TEST_HOST}/some/random/path`;
            const getUrlInfoWrapper = () => {
                return getUrlInfo(testUrl);
            };
            expect(getUrlInfoWrapper).toThrowError(`Invalid embedding url: "${testUrl}"`);
        });
    });
});
