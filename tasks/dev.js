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
    rimraf          = require('gulp-rimraf'),
    rubySass        = require('gulp-ruby-sass'),
    size            = require('gulp-size'),
    sourcemaps      = require('gulp-sourcemaps'),
    buildConfig     = require('../config/buildconfig'),
    bowerComponents = require('../config/bowercomponents');

/**
    TASK: dev:connect
    Start a new connect server with livereload support on development settings.
*/
gulp.task('dev:connect', function() {

    logTaskStartup('Startup connect server (development)...');

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
gulp.task('dev:css', function() {

    logTaskStartup('RUN TASK: CSS (development)...');

    return gulp.src('./src/scss/**/*.{scss,sass}')
        .pipe(plumber())
        .pipe(rubySass({
            style: 'expanded', // nested, compact, compressed, expanded
            lineNumbers: true, // Emit comments in the generated CSS indicating the corresponding source line.
            cacheLocation: './src/scss/.sass-cache'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade: false
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
gulp.task('dev:js', function() {

    logTaskStartup('RUN TASK: JavaScript (development)...');

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
gulp.task('jshint', function() {

    logTaskStartup('RUN TASK: jshint...');

    return gulp.src('./src/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/**
    TASK: dev:imagemin
    Apply image and SVG minification on development settings.
*/
gulp.task('dev:imagemin', function() {

    logTaskStartup('RUN TASK: imagemin (development)...');

    var imgFilter = filter('**/*.{png,jpg,jpeg,gif}'),
        svgFilter = filter('**/*.svg');

    return gulp.src(['./src/assets/images/**/*.{png,jpg,jpeg,gif}', './src/assets/svgs/**/*.svg'])
        .pipe(plumber())
        .pipe(imagemin({
            progressive: false, // (jpg)
            optimizationLevel: 3, // (png) (0-7 low-high)
            interlaced: false, // (gif)
            svgoPlugins: [{ removeViewBox: false }] // (svg)
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
    Inject all CSS and JavaScript into index.html document.
*/
gulp.task('dev:inject', function() {

    logTaskStartup('RUN TASK: inject (development)...');

    var target = gulp.src('./src/templates/**/*.html');

    // get css and js folder names
    var cssPath = buildConfig.dev.paths.css,
        jsPath = buildConfig.dev.paths.js,
        cssFolderName = cssPath.split('/').pop(),
        jsFolderName = jsPath.split('/').pop();

    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(
        [
            cssFolderName + '/**/*.css',
            jsFolderName + '/**/jquery.js',
            jsFolderName + '/**/jquery.*.js',
            jsFolderName + '/**/MyClass.js',
            jsFolderName + '/**/MyChildClass.js',
            jsFolderName + '/**/*.js',
            '!' + jsFolderName + '/' + buildConfig.prod.mainJsFileName + '.min.js'
        ],
        {
            read: false,
            cwd: buildConfig.dev.rootDir
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
gulp.task('dev:clear', function(cb) {

    logTaskStartup('RUN TASK: clear files (development)...');

    return gulp.src(buildConfig.dev.rootDir, { read: false })
        .pipe(rimraf());
});

/**
    TASK: dev:videos
    Copy videos to development folder.
*/
gulp.task('dev:videos', function() {

    logTaskStartup('RUN TASK: copy videos (development)...');

    return gulp.src('./src/assets/videos/**/*.{mp4,ogv}')
        .pipe(gulp.dest(buildConfig.dev.paths.videos));
});

/**
    TASK: dev:fonts
    Copy fonts to development folder.
*/
gulp.task('dev:fonts', function() {

    logTaskStartup('RUN TASK: copy fonts (development)...');

    return gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest(buildConfig.dev.paths.fonts));
});

/**
    TASK: dev:favicons
    Copy favicons to development folder.
*/
gulp.task('dev:favicons', function() {

    logTaskStartup('RUN TASK: copy favicons (development)...');

    return gulp.src('./src/favicons/**/*.{ico,png}')
        .pipe(gulp.dest(buildConfig.dev.rootDir));
});

/**
    TASK: dev:rootfiles
    Copy rootfiles to development folder.
*/
gulp.task('dev:rootfiles', function() {

    logTaskStartup('RUN TASK: copy rootfiles (development)...');

    return gulp.src('./src/rootfiles/**/*')
        .pipe(gulp.dest(buildConfig.dev.rootDir));
});

/**
    TASK: dev:watch
    Watch files in development mode and run only the necessary tasks when certain file types change.
*/
gulp.task('dev:watch', function(cb) {

    gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

    gulp.watch('./src/scss/**/*.{scss,sass}',                   ['dev:css']);
    gulp.watch('./src/scripts/**/*.js',                         ['jshint', 'dev:js']);
    gulp.watch('./src/assets/images/**/*.{png,jpg,jpeg,gif}',   ['dev:imagemin']);
    gulp.watch('./src/assets/svgs/**/*.svg',                    ['dev:imagemin']);
    gulp.watch('./src/assets/videos/**/*.{mp4,ogv}',            ['dev:videos']);
    gulp.watch('./src/favicons/**/*.{ico,png}',                 ['dev:favicons']);
    gulp.watch('./src/rootfiles/**/*',                          ['dev:rootfiles']);
    gulp.watch('./src/templates/**/*.html',                     ['dev:inject']);
});

/**
    logTaskStartup
    Helper function that formats and logs tasks startups
*/
function logTaskStartup(logString) {
    gutil.log(
        gutil.colors.inverse(
            buildConfig.logSepDecor + logString + buildConfig.logSepDecor
        )
    );
}
