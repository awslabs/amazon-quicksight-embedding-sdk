import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const srcPath = path.resolve(__dirname, 'src');
const entry = path.resolve(srcPath, 'index.ts');
const distPath = path.resolve(__dirname, 'dist');

const {
    license,
    name,
    repository,
    version,
} = JSON.parse(fs.readFileSync(path.join(__dirname, './package.json'), 'utf-8'));

const webpackBanner = `    ${name} v${version}
    ${repository.url}
    Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    SPDX-License-Identifier: ${license}`;

const config = () => {
    const stage = process.env.STAGE || 'local';
    const isProd = stage === 'prod';
    return {
        mode: isProd ? 'production' : 'development',
        entry,
        output: {
            path: distPath,
            filename: `quicksight-embedding-js-sdk.${isProd ? 'min' : 'dev'}.js`,
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(ts|js)$/i,
                    exclude: /node_modules/,
                    include: srcPath,
                    use: [{
                        loader: 'babel-loader',
                    }]
                },
                {
                    test: /src\/index.ts/,
                    use: [{
                        loader: 'expose-loader',
                        options: {
                            exposes: {
                                globalName: 'QuickSightEmbedding',
                                override: true
                            }
                        }
                    }]
                }
            ]
        },
        plugins: [
            new webpack.BannerPlugin(webpackBanner),
            new webpack.DefinePlugin({
                __SDK_VERSION__: JSON.stringify(version),
            }),
            new ForkTsCheckerWebpackPlugin()
        ],
        devServer: isProd ? undefined : {
            allowedHosts: 'all',
            port: 8080,
            server: 'https',
            host: '0.0.0.0',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        },
    };
};

export default config;
