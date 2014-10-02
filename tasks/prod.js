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
    rimraf          = require('gulp-rimraf'),
    rubySass        = require('gulp-ruby-sass'),
    size            = require('gulp-size'),
    sourcemaps      = require('gulp-sourcemaps'),
    stripDebug      = require('gulp-strip-debug'),
    uglify          = require('gulp-uglify'),
    buildConfig     = require('../config/buildconfig'),
    bowerComponents = require('../config/bowercomponents');

/**
    TASK: prod:connect
    Start a new connect server with livereload support on production settings.
*/
gulp.task('prod:connect', function() {

    logTaskStartup('Startup connect server (production)...');

    return connect.server({
        root:       buildConfig.prod.rootDir,
        livereload: buildConfig.dev.connectServer.livereload,
        port:       buildConfig.dev.connectServer.port
    });
});

/**
    TASK: prod:css
    Compile scss to css with ruby-sass with production settings.
*/
gulp.task('prod:css', function() {

    logTaskStartup('RUN TASK: CSS (production)...');

    return gulp.src('./src/scss/**/*.{scss,sass}')
        .pipe(plumber())
        .pipe(rubySass({
            style: 'compressed', // nested, compact, compressed, expanded
            lineNumbers: false, // Emit comments in the generated CSS indicating the corresponding source line.
            cacheLocation: './src/scss/.sass-cache'
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade: false
        }))
        .on('error', function(err) { console.log(err.message); })
        .pipe(size({ title: 'CSS (compressed)' }))
        .pipe(gulp.dest(buildConfig.prod.paths.css))
        .pipe(connect.reload());
});

/**
    TASK: prod:js
    Concat, minify, and move final JavaScript files to corresponding production path.
*/
gulp.task('prod:js', function() {

    logTaskStartup('RUN TASK: JavaScript (production)...');

    var jsCompileArr = bowerComponents.concat(
        [
            './src/scripts/**/jquery.js',
            './src/scripts/**/jquery.*.js',
            './src/scripts/**/MyClass.js',
            './src/scripts/**/MyChildClass.js',
            './src/scripts/**/*.js'
        ]);

    return gulp.src(jsCompileArr)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat(buildConfig.prod.mainJsFileName + '.min.js'))
        .pipe(stripDebug())
        .pipe(uglify({
            mangle: buildConfig.prod.jsMangle,
            compress: true,
            preserveComments: buildConfig.prod.jsComments
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(size({ title: 'JavaScript (compressed)' }))
        .pipe(gulp.dest(buildConfig.prod.paths.js))
        .pipe(connect.reload());
});

/**
    TASK: prod:imagemin
    Apply image and SVG minification on production settings.
*/
gulp.task('prod:imagemin', function() {

    logTaskStartup('RUN TASK: imagemin (production)...');

    var imgFilter = filter('**/*.{png,jpg,jpeg,gif}'),
        svgFilter = filter('**/*.svg');

    return gulp.src(['./src/assets/images/**/*.{png,jpg,jpeg,gif}', './src/assets/svgs/**/*.svg'])
        .pipe(plumber())
        .pipe(imagemin({
            progressive: false, // (jpg)
            optimizationLevel: 7, // (png) (0-7 low-high)
            interlaced: false, // (gif)
            svgoPlugins: [{ removeViewBox: false }] // (svg)
        }))
        .pipe(imgFilter)
        .pipe(gulp.dest(buildConfig.prod.paths.images))
        .pipe(imgFilter.restore())
        .pipe(svgFilter)
        .pipe(gulp.dest(buildConfig.prod.paths.svgs))
        .pipe(connect.reload());
});

/**
    TASK: prod:inject
    Inject minified CSS and JavaScript into index.html document.
*/
gulp.task('prod:inject', function() {

    logTaskStartup('RUN TASK: inject (production)...');

    var target = gulp.src('./src/templates/**/*.html');

    // get css and js folder names
    var cssPath = buildConfig.prod.paths.css,
        jsPath = buildConfig.prod.paths.js,
        cssFolderName = cssPath.split('/').pop(),
        jsFolderName = jsPath.split('/').pop();

    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(
        [
            cssFolderName + '/**/*.css',
            jsFolderName + '/**/*.js'
        ],
        {
            read: false,
            cwd: buildConfig.prod.rootDir
        });

    return target.pipe(inject(sources))
        .pipe(plumber())
        .pipe(gulp.dest(buildConfig.prod.rootDir))
        .pipe(connect.reload());
});

/**
    TASK: prod:clear
    Delete the production folder.
*/
gulp.task('prod:clear', function(cb) {

    logTaskStartup('RUN TASK: clear files (production)...');

    return gulp.src(buildConfig.prod.rootDir, { read: false })
        .pipe(rimraf());
});

/**
    TASK: prod:videos
    Copy videos to production folder.
*/
gulp.task('prod:videos', function() {

    logTaskStartup('RUN TASK: copy videos (production)...');

    return gulp.src('./src/assets/videos/**/*.{mp4,ogv}')
        .pipe(gulp.dest(buildConfig.prod.paths.videos));
});

/**
    TASK: prod:fonts
    Copy fonts to production folder.
*/
gulp.task('prod:fonts', function() {

    logTaskStartup('RUN TASK: copy fonts (production)...');

    return gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff}')
        .pipe(gulp.dest(buildConfig.prod.paths.fonts));
});

/**
    TASK: prod:favicons
    Copy favicons to production folder.
*/
gulp.task('prod:favicons', function() {

    logTaskStartup('RUN TASK: copy favicons (production)...');

    return gulp.src('./src/favicons/**/*.{ico,png}')
        .pipe(gulp.dest(buildConfig.prod.rootDir));
});

/**
    TASK: prod:rootfiles
    Copy rootfiles to production folder.
*/
gulp.task('prod:rootfiles', function() {

    logTaskStartup('RUN TASK: copy rootfiles (production)...');

    return gulp.src('./src/rootfiles/**/*')
        .pipe(gulp.dest(buildConfig.prod.rootDir));
});

/**
    TASK: prod:watch
    Watch files in production mode and run only the necessary tasks when certain file types change.
*/
gulp.task('prod:watch', function(cb) {

    gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

    gulp.watch('./src/scss/**/*.{scss,sass}',                   ['prod:css']);
    gulp.watch('./src/scripts/**/*.js',                         ['prod:js']);
    gulp.watch('./src/assets/images/**/*.{png,jpg,jpeg,gif}',   ['prod:imagemin']);
    gulp.watch('./src/assets/svgs/**/*.svg',                    ['prod:imagemin']);
    gulp.watch('./src/assets/videos/**/*.{mp4,ogv}',            ['prod:videos']);
    gulp.watch('./src/favicons/**/*.{ico,png}',                 ['prod:favicons']);
    gulp.watch('./src/rootfiles/**/*',                          ['prod:rootfiles']);
    gulp.watch('./src/templates/**/*.html',                     ['prod:inject']);
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
