const config = {
    roots: ['<rootDir>/tst'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|js)x?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./jest-setup.ts'],
    globals: {
        __SDK_VERSION__: 'testSdkVersion',
    },
};

export default config;
