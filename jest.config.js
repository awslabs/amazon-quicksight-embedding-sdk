/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const {pathsToModuleNameMapper} = require('ts-jest');
const {compilerOptions} = require('./tsconfig.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: [
        '<rootDir>/tst/',
    ],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                babelConfig: true,
            },
        ],
    },
    setupFilesAfterEnv: ['./jest-setup.ts'],
    globals: {
        __SDK_VERSION__: 'testSdkVersion',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**'
    ],
    coverageThreshold: {
        global: {
            branches: 81.6,
            functions: 90,
            lines: 90,
            statements: -45
        },
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'} )
};