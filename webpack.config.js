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