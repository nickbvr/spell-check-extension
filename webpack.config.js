const path = require('path');

module.exports = {
    entry: {
        content: './src/content.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: '$',
        libraryTarget: 'umd',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
