/** --------------------------------------------------------
    tasks/dev.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Tasks for development builds.
    -------------------------------------------------------- */

/**
    Required Modules
*/
var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    connect         = require('gulp-connect'),
    filter          = require('gulp-filter'),
    imagemin        = require('gulp-imagemin'),
    inject          = require('gulp-inject'),
    gutil           = require('gulp-util'),
    jshint          = require('gulp-jshint'),
    plumber         = require('gulp-plumber'),
    del             = require('del'),
    rubySass        = require('gulp-ruby-sass'),
    size            = require('gulp-size'),
    sourcemaps      = require('gulp-sourcemaps'),
    replace         = require('gulp-replace'),
    buildConfig     = require('../config/buildConfig'),
    bowerComponents = require('../config/bowerComponents'),
    jsCompileFiles  = require('../config/jsCompileFiles'),
    Helpers         = require('../util/helpers');

/**
    TASK: dev:connect
    Start a new connect server with livereload support on development settings.
*/
gulp.task('dev:connect', function () {

    Helpers.logTaskStartup('Startup connect server (development)...');

    return connect.server({
        root:       buildConfig.dev.rootDir,
        livereload: buildConfig.dev.connectServer.livereload,
        port:       buildConfig.dev.connectServer.port
    });
});

/**
    TASK: dev:css
    Compile scss to css with ruby-sass with development settings.
*/
gulp.task('dev:css', function () {

    Helpers.logTaskStartup('RUN TASK: CSS (development)...');

    return gulp.src('./src/scss/**/*.{scss,sass}')
        .pipe(plumber())
        .pipe(rubySass({
            style:          'expanded', // nested, compact, compressed, expanded
            lineNumbers:    true, // Emit comments in the generated CSS indicating the corresponding source line.
            cacheLocation: './src/scss/.sass-cache'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade:  false
        }))
        .on('error', function(err) { console.log(err.message); })
        .pipe(size({ title: 'CSS (uncompressed)' }))
        .pipe(gulp.dest(buildConfig.dev.paths.css))
        .pipe(connect.reload());
});

/**
    TASK: dev:js
    Copy full JavaScript files to corresponding development path.
*/
gulp.task('dev:js', function () {

    Helpers.logTaskStartup('RUN TASK: JavaScript (development)...');

    /* Gather all JavaScripts and then copy to dev folder */
    var jsCompileArr = bowerComponents.concat(
        [
            './src/scripts/**/*.js',
            '!./src/scripts/' + buildConfig.prod.mainJsFileName + '.min.js'
        ]);

    return gulp.src(jsCompileArr)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('maps'))
        .pipe(size({ title: 'JavaScript (uncompressed)' }))
        .pipe(gulp.dest(buildConfig.dev.paths.js))
        .pipe(connect.reload());
});

/**
    TASK: jshint
    jshint JavaScript files.
*/
gulp.task('jshint', function () {

    Helpers.logTaskStartup('RUN TASK: jshint...');

    return gulp.src('./src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/**
    TASK: dev:imagemin
    Apply image and SVG minification on development settings.
*/
gulp.task('dev:imagemin', function () {

    Helpers.logTaskStartup('RUN TASK: imagemin (development)...');

    var imgFilter = filter('**/*.{png,jpg,jpeg,gif}'),
        svgFilter = filter('**/*.svg');

    return gulp.src(['./src/assets/images/**/*.{png,jpg,jpeg,gif}', './src/assets/svgs/**/*.svg'])
        .pipe(plumber())
        .pipe(imagemin({
            progressive:       false,                     // (jpg)
            optimizationLevel: 3,                         // (png) (0-7 low-high)
            interlaced:        false,                     // (gif)
            svgoPlugins:       [{ removeViewBox: false }] // (svg)
        }))
        .pipe(imgFilter)
        .pipe(gulp.dest(buildConfig.dev.paths.images))
        .pipe(imgFilter.restore())
        .pipe(svgFilter)
        .pipe(gulp.dest(buildConfig.dev.paths.svgs))
        .pipe(connect.reload());
});

/**
    TASK: dev:inject
    Inject all CSS and JavaScript into HTML documents.
*/
gulp.task('dev:inject', function () {

    Helpers.logTaskStartup('RUN TASK: inject (development)...');

    var target = gulp.src('./src/templates/**/*.html');

    // Get css and js folder names
    var cssPath       = buildConfig.dev.paths.css,
        jsPath        = buildConfig.dev.paths.js,
        cssFolderName = cssPath.split('/').pop(),
        jsFolderName  = jsPath.split('/').pop();

    /* Loop through JavaScript files to compile and 
        prepend js folder path */
    var jsCompileFilesWithPath = [];
    for(var i = 0; i < jsCompileFiles.length; i++)
        jsCompileFilesWithPath.push(jsFolderName + jsCompileFiles[i]);

    var cssFiles      = [ cssFolderName + '/**/*.css' ],
        excludeProdJs = [ '!' + jsFolderName + '/' + buildConfig.prod.mainJsFileName + '.min.js' ];

    // Gather all CSS and JavaScript paths
    var allFilePaths = cssFiles.concat(jsCompileFilesWithPath).concat(excludeProdJs);

    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(
        allFilePaths,
        {
            read: false,
            cwd:  buildConfig.dev.rootDir
        });

    return target.pipe(inject(sources))
        .pipe(plumber())
        .pipe(gulp.dest(buildConfig.dev.rootDir))
        .pipe(connect.reload());
});

/**
    TASK: dev:clear
    Delete the development folder.
*/
gulp.task('dev:clear', function (cb) {

    Helpers.logTaskStartup('RUN TASK: clear files (development)...');

    return del(buildConfig.dev.rootDir, cb);
});

/**
    TASK: dev:videos
    Copy videos to development folder.
*/
gulp.task('dev:videos', function () {

    Helpers.logTaskStartup('RUN TASK: copy videos (development)...');

    return gulp.src('./src/assets/videos/**/*.{mp4,ogv}')
        .pipe(gulp.dest(buildConfig.dev.paths.videos));
});

/**
    TASK: dev:fonts
    Copy fonts to development folder.
*/
gulp.task('dev:fonts', function () {

    Helpers.logTaskStartup('RUN TASK: copy fonts (development)...');

    return gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest(buildConfig.dev.paths.fonts));
});

/**
    TASK: dev:favicons
    Copy favicons to development folder.
*/
gulp.task('dev:favicons', function () {

    Helpers.logTaskStartup('RUN TASK: copy favicons (development)...');

    return gulp.src('./src/favicons/**/*.{ico,png}')
        .pipe(gulp.dest(buildConfig.dev.rootDir));
});

/**
    TASK: dev:rootfiles
    Copy rootfiles to development folder.
*/
gulp.task('dev:rootfiles', function () {

    Helpers.logTaskStartup('RUN TASK: copy rootfiles (development)...');

    return gulp.src('./src/rootfiles/**/*')
        .pipe(gulp.dest(buildConfig.dev.rootDir));
});
