/** --------------------------------------------------------
    tasks/kss.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Tasks KSS documentation generation.
    -------------------------------------------------------- */

var gulp         = require('gulp'),
    kss          = require('gulp-kss'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    plumber      = require('gulp-plumber'),
    rubySass     = require('gulp-ruby-sass'),
    size         = require('gulp-size'),
    buildConfig  = require('../config/buildConfig'),
    Helpers      = require('../util/helpers');

/**
    TASK: kss
    Generate KSS documentation.
*/
gulp.task('kss', function () {

    Helpers.logTaskStartup('RUN TASK: kss...');

    // Copy over master.css to styleguide path, and rename it to style.css
    gulp.src(buildConfig.dev.paths.css + '/master.css')
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./src/styleguide/dist/public'));

    // Copy over javascripts needed for styleguide demos
    gulp.src(buildConfig.dev.paths.js + '/**/*.js')
        .pipe(gulp.dest('./src/styleguide/dist/public/js'));

    // Compile SASS for KSS theme
    gulp.src('./src/styleguide/template/scss/**/*.{scss,sass}')
        .pipe(plumber())
        .pipe(rubySass({
            style:            'expanded', // nested, compact, compressed, expanded
            lineNumbers:      true, // Emit comments in the generated CSS indicating the corresponding source line.
            cacheLocation:    './src/styleguide/template/scss/.sass-cache',
            "sourcemap=none": true // temp hack -- http://stackoverflow.com/questions/27068915/gulp-ruby-sass-and-autoprefixer-do-not-get-along
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9'],
            cascade:  false
        }))
        .on('error', function(err) { console.log(err.message); })
        .pipe(size({ title: 'CSS (uncompressed)' }))
        .pipe(gulp.dest('./src/styleguide/dist/public/'))

    // Run KSS parser on all scss/sass
    return gulp.src(['./src/scss/**/*.{scss,sass}'])
        .pipe(kss({
            overview: 'src/styleguide/template/styleguide.md',
            templateDirectory: 'src/styleguide/template'
        }))
        .pipe(gulp.dest('./src/styleguide/dist'));
});
