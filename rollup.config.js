import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import {babel} from '@rollup/plugin-babel';
import flatDts from 'rollup-plugin-flat-dts';
import sourcemaps from 'rollup-plugin-sourcemaps';
import analyze from 'rollup-plugin-analyzer';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import eslint from '@rollup/plugin-eslint';
import serve from 'rollup-plugin-serve';
import * as fs from 'fs';

const banner = `/*! 
* ${pkg.name} v${pkg.version}
* ${pkg.repository.url}
* ${pkg.homepage}
* 
* Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: ${pkg.license}
*/`;

const mode = process.env.mode;

const commonPlugins = [
    typescript({
        noForceEmit: true,
        compilerOptions: {
            declaration: false,
            noEmit: true,
        },
    }),
    resolve({
        browser: true,
        preferBuiltins: false,
    }),
    babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [
            [
                '@babel/plugin-transform-runtime',
                {
                    regenerator: true,
                    helpers: false,
                },
            ],
        ],
        extensions: ['.ts'],
    }),
];

// Rollup pipes plugin output sequentially so order matter
const productionPlugins = [
    eslint({
        throwOnError: true,
    }),
    ...commonPlugins,
    analyze({
        summaryOnly: true,
    }),
    terser(),
    sourcemaps(),
    flatDts(),
];

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                name: 'QuickSightEmbedding',
                file: pkg.browser,
                sourcemap: true,
                format: 'umd',
                banner,
            },
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
                banner,
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
                banner,
            },
        ],
        plugins:
            mode === 'production'
                ? [del({targets: 'dist/*'}), ...productionPlugins]
                : [
                      del({targets: 'dist/*'}),
                      ...commonPlugins,
                      serve({
                          contentBase: 'dist',
                          host: '0.0.0.0',
                          port: 8080,
                          headers: {
                              'Access-Control-Allow-Origin': '*',
                          },
                          https: {
                              key: fs.readFileSync('./ssl/server.key'),
                              cert: fs.readFileSync('./ssl/server.cert'),
                          },
                      }),
                  ],
    },
];
