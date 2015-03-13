// var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
    context: __dirname + '/src/scripts/',
    entry: {
        // index: './pages/index'
        main: './main'
    },
    output: {
        filename:      '[name].bundle.js',
        chunkFilename: '[id].bundle.js',
        path:          __dirname + '/dev/js',
        publicPath:    '/js/'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' }
        ]
    },
    plugins: [
        // new CommonsChunkPlugin('commons.chunk.js')
    ],
    debug: true
};
