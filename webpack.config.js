// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

module.exports = {
    module: {
        rules: [{
            test: /index.js/,
            use: [{
                loader: 'expose-loader',
                options: 'QuickSightEmbedding'
            }]
        }]

    }
};