/** --------------------------------------------------------
    tasks/prod.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Tasks for production builds.
    -------------------------------------------------------- */

/**
    Required Modules
*/
var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    concat          = require('gulp-concat'),
    connect         = require('gulp-connect'),
    filter          = require('gulp-filter'),
    imagemin        = require('gulp-imagemin'),
    inject          = require('gulp-inject'),
    gutil           = require('gulp-util'),
    plumber         = require('gulp-plumber'),
    del             = require('del'),
    rubySass        = require('gulp-ruby-sass'),
    size            = require('gulp-size'),
    stripDebug      = require('gulp-strip-debug'),
    uglify          = require('gulp-uglify'),
    replace         = require('gulp-replace'),
    babel           = require('gulp-babel'),
    gulpif          = require('gulp-if'),
    swig            = require('gulp-swig'),
    buildConfig     = require('../config/buildConfig'),
    bowerComponents = require('../config/bowerComponents'),
    jsCompileFiles  = require('../config/jsCompileFiles'),
    jsCDNFiles      = require('../config/jsCDNFiles'),
    Helpers         = require('../util/helpers');

/**
    TASK: prod:connect
    Start a new connect server with livereload support on production settings.
*/
gulp.task('prod:connect', function () {

    Helpers.logTaskStartup('Startup connect server (production)...');

    return connect.server({
        root:       buildConfig.prod.rootDir,
        livereload: buildConfig.prod.connectServer.livereload,
        port:       buildConfig.prod.connectServer.port
    });
});

/**
    TASK: prod:css
    Compile scss to css with ruby-sass with production settings.
*/
gulp.task('prod:css', function () {

    Helpers.logTaskStartup('RUN TASK: CSS (production)...');

    return rubySass('./src/scss/master.scss', {
            style:         'compressed', // nested, compact, compressed, expanded
            lineNumbers:   false, // Emit comments in the generated CSS indicating the corresponding source line.
            cacheLocation: './src/scss/.sass-cache',
            sourcemap:     false
        })
        .on('error', function (err) {
            console.error('SASS Error!', err.message);
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade:  false
        }))
        .pipe(size({ title: 'CSS (uncompressed)' }))
        .pipe(gulp.dest(buildConfig.prod.paths.css))
        .pipe(connect.reload());
});

/**
    TASK: prod:js
    Concat, minify, and move final JavaScript files to corresponding production path.
*/
gulp.task('prod:js', function () {

    Helpers.logTaskStartup('RUN TASK: JavaScript (production)...');

    /* Loop through JavaScript files to compile and 
        prepend scripts folder path */
    var jsCompileFilesWithPath = [],
        bowerFilesWithCDN      = [];

    for(var i = 0; i < jsCompileFiles.length; i++) {

        // Determine if there is a CDN instance of this script
        var canUse = true;

        if(buildConfig.prod.useCdn)
            for(var j = 0; j < jsCDNFiles.length; j++)
                if(jsCompileFiles[i] === jsCDNFiles[j].filePath)
                    canUse = false;

        if(canUse)
            // Include this script in the compile
            jsCompileFilesWithPath.push('./src/scripts' + jsCompileFiles[i]);
        else
            // Ignore including script for compile if CDN had been set up
            jsCompileFilesWithPath.push('!./src/scripts' + jsCompileFiles[i]);
    }

    /* Loop through bower components and determine if any have CDN
        references and should be excluded from the build process.
    */
    if(buildConfig.prod.useCdn) {
        for(var i = 0; i < bowerComponents.length; i++) {

            // Determine if there is a CDN instance of this script
            var canUse = true;
            for(var j = 0; j < jsCDNFiles.length; j++)
                if(bowerComponents[i] === jsCDNFiles[j].filePath)
                    canUse = false;

            // Ignore including script for compile if CDN had been set up
            if(!canUse) {
                jsCompileFilesWithPath.push('!' + bowerComponents[i]);

                // Flag this bower file to not compile because it's already being included on a CDN
                bowerFilesWithCDN.push('!' + bowerComponents[i]);
            }
        }
    }

    /* Gather JavaScripts paths for vendor and application scripts. */
    var vendorJS = bowerComponents.concat(bowerFilesWithCDN),
        appJS    = jsCompileFilesWithPath.concat(['./src/scripts/**/*.js']);

    // Compile vendor JavaScript
    gulp.src(vendorJS)
        .pipe(plumber())
        .pipe(concat(buildConfig.prod.vendorJsFileName + '.min.js'))
        .pipe(stripDebug())
        .pipe(uglify({
            mangle:           buildConfig.prod.jsMangle,
            compress:         true,
            preserveComments: buildConfig.prod.jsComments
        }))
        .pipe(size({ title: 'Vendor JavaScript (compressed)' }))
        .pipe(gulp.dest(buildConfig.prod.paths.vendorJs));

    // Compile application JavaScript, run Babel (ES6)
    return gulp.src(appJS)
        .pipe(plumber())
        .pipe(gulpif(buildConfig.prod.useES6, babel()))
        .pipe(concat(buildConfig.prod.mainJsFileName + '.min.js'))
        .pipe(stripDebug())
        .pipe(uglify({
            mangle:           buildConfig.prod.jsMangle,
            compress:         true,
            preserveComments: buildConfig.prod.jsComments
        }))
        .pipe(size({ title: 'Application JavaScript (compressed)' }))
        .pipe(gulp.dest(buildConfig.prod.paths.js))
        .pipe(connect.reload());
});

/**
    TASK: prod:imagemin
    Apply image and SVG minification on production settings.
*/
gulp.task('prod:imagemin', function () {

    Helpers.logTaskStartup('RUN TASK: imagemin (production)...');

    var imgFilter = filter('**/*.{png,jpg,jpeg,gif}'),
        svgFilter = filter('**/*.svg');

    return gulp.src(['./src/assets/images/**/*.{png,jpg,jpeg,gif}', './src/assets/svgs/**/*.svg'])
        .pipe(plumber())
        .pipe(imgFilter)
        .pipe(imagemin({
            progressive:       false,                     // (jpg)
            optimizationLevel: 7,                         // (png) (0-7 low-high)
            interlaced:        false,                     // (gif)
            svgoPlugins:       [{ removeViewBox: false }] // (svg)
        }))
        .pipe(gulp.dest(buildConfig.prod.paths.images))
        .pipe(imgFilter.restore())
        .pipe(svgFilter)
        .pipe(gulp.dest(buildConfig.prod.paths.svgs))
        .pipe(connect.reload());
});

/**
    TASK: prod:html
    - Inject minified CSS and JavaScript into HTML documents.
    - Parse Swig templating.
*/
gulp.task('prod:html', function () {

    Helpers.logTaskStartup('RUN TASK: html (production)...');

    var target = gulp.src('./src/views/**/*.html');

    // get css and js folder names
    var cssPath       = buildConfig.prod.paths.css,
        jsPath        = buildConfig.prod.paths.js,
        cssFolderName = cssPath.split('/').pop(),
        jsFolderName  = jsPath.split('/').pop();

    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(
        [
            cssFolderName + '/**/*.css',
            jsFolderName + '/**/*.js'
        ],
        {
            read: false,
            cwd:  buildConfig.prod.rootDir
        });

    // Generate CDN script includes
    var cdnScriptTags = '';
    if(buildConfig.prod.useCdn)
        for(var i = 0; i < jsCDNFiles.length; i++)
            cdnScriptTags += '<script src="' + jsCDNFiles[i].cdnPath + '"></script>';

    return target.pipe(plumber())
        .pipe(swig({
            setup: function (swig) {
                swig.setDefaults({
                    autoescape: false,
                    cache: false,
                    loader: swig.loaders.fs('./src/views/')
                });
            }
        }))
        .pipe(inject(sources))
        .pipe(replace('<!-- replace:js-cdn -->', cdnScriptTags))
        .pipe(gulp.dest(buildConfig.prod.rootDir))
        .pipe(connect.reload());
});

/**
    TASK: prod:clear
    Delete the production folder.
*/
gulp.task('prod:clear', function (cb) {

    Helpers.logTaskStartup('RUN TASK: clear files (production)...');

    return del(buildConfig.prod.rootDir, cb);
});

/**
    TASK: prod:videos
    Copy videos to production folder.
*/
gulp.task('prod:videos', function () {

    Helpers.logTaskStartup('RUN TASK: copy videos (production)...');

    return gulp.src('./src/assets/videos/**/*.{mp4,ogv}')
        .pipe(gulp.dest(buildConfig.prod.paths.videos));
});

/**
    TASK: prod:fonts
    Copy fonts to production folder.
*/
gulp.task('prod:fonts', function () {

    Helpers.logTaskStartup('RUN TASK: copy fonts (production)...');

    return gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest(buildConfig.prod.paths.fonts));
});

/**
    TASK: prod:favicons
    Copy favicons to production folder.
*/
gulp.task('prod:favicons', function () {

    Helpers.logTaskStartup('RUN TASK: copy favicons (production)...');

    return gulp.src('./src/favicons/**/*.{ico,png}')
        .pipe(gulp.dest(buildConfig.prod.rootDir));
});

/**
    TASK: prod:rootfiles
    Copy rootfiles to production folder.
*/
gulp.task('prod:rootfiles', function () {

    Helpers.logTaskStartup('RUN TASK: copy rootfiles (production)...');

    return gulp.src('./src/rootfiles/**/*')
        .pipe(gulp.dest(buildConfig.prod.rootDir));
});
