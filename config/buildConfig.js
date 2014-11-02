/** --------------------------------------------------------
    config/buildConfig.js
    --------------------------------------------------------
    @author Keenan Staffieri
    GulpJS build configuration settings for kplate.
    -------------------------------------------------------- */

/**
    buildConfig
    Configuration options for project build tasks.
*/
var buildConfig = {
    dev: {
        rootDir: './dev',   // Directory where the site will be hosted
        paths: {
            css:    './dev/css',    // Path to CSS files
            js:     './dev/js',     // Path to JavaScript files
            images: './dev/images', // Path to images
            svgs:   './dev/svgs',   // Path to SVGs
            videos: './dev/videos', // Path to videos
            fonts:  './dev/fonts'   // Path to fonts
        },
        connectServer: {
            livereload: true,   // Will browser reload automatically when changes are made?
            port: 8000          // Port in which the site will be hosted locally (http://localhost:[PORT])
        }
    },
    prod: {
        rootDir: './prod',  // Directory where the site will be hosted
        paths: {
            css:    './prod/css',       // Path to CSS files
            js:     './prod/js',        // Path to JavaScript files
            images: './prod/images',    // Path to images
            svgs:   './prod/svgs',      // Path to SVGs
            videos: './prod/videos',    // Path to videos
            fonts:  './prod/fonts'      // Path to fonts
        },
        connectServer: {
            livereload: true,   // Will browser reload automatically when changes are made?
            port: 8000          // Port in which the site will be hosted locally (http://localhost:[PORT])
        },
        jsMangle: true,         // "uglify" the JavaScript
        jsComments: false,      // false or 'all'
        useCdn: true,
        mainJsFileName: 'main'  // JavaScript filename where all resources concat into it
    },
    logSepDecor: ' *** ' // Logger decor separator for RUN TASK
};

// Make buildConfig available from require
module.exports = buildConfig;
