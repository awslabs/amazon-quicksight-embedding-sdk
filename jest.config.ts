const config = {
    roots: ['<rootDir>/tst'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|js)x?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./jest-setup.ts'],
};

export default config;
