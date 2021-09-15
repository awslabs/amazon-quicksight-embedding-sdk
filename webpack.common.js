const path = require('path');

const distPath = path.resolve(__dirname, 'dist');
const entry = path.resolve(distPath, 'index.js');

module.exports = {
    entry,
    output: {
        path: distPath,
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /index.js/,
            use: [{
                loader: 'expose-loader',
                options: {
                    exposes: 'QuickSightEmbedding'
                }
            }]
        }]

    }
};
