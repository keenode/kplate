/** --------------------------------------------------------
    tasks/dev-watch.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Watch task for development mode.
    -------------------------------------------------------- */

/**
    Required Modules
*/
var gulp  = require('gulp'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util');

/**
    TASK: dev:watch
    Watch files in development mode and run only the necessary tasks when certain file types change.
*/
gulp.task('dev:watch', function(cb) {

    gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

    // WATCH SCSS
    watch(
        'src/scss/**/*.{scss,sass}',
        { name: 'WATCH SCSS', read: false },
        function() {
            gulp.start('dev:css');
    });

    // WATCH JavaScript
    watch(
        'src/scripts/**/*.js',
        { name: 'WATCH JavaScript', read: false },
        function() {
            gulp.start('jshint');
            gulp.start('dev:js');
    });

    // WATCH Fonts
    watch(
        'src/assets/fonts/**/*',
        { name: 'WATCH Fonts', read: false },
        function() {
            gulp.start('dev:fonts');
    });

    // WATCH Images
    watch(
        'src/assets/images/**/*.{png,jpg,jpeg,gif}',
        { name: 'WATCH Images', read: false },
        function() {
            gulp.start('dev:imagemin');
    });

    // WATCH SVGs
    watch(
        'src/assets/svgs/**/*.svg',
        { name: 'WATCH SVGs', read: false },
        function() {
            gulp.start('dev:imagemin');
    });

    // WATCH Videos
    watch(
        'src/assets/videos/**/*.{mp4,ogv}',
        { name: 'WATCH Videos', read: false },
        function() {
            gulp.start('dev:videos');
    });

    // WATCH Favicons
    watch(
        'src/favicons/**/*.{ico,png}',
        { name: 'WATCH Favicons', read: false },
        function() {
            gulp.start('dev:favicons');
    });

    // WATCH Rootfiles
    watch(
        'src/rootfiles/**/*',
        { name: 'WATCH Rootfiles', read: false },
        function() {
            gulp.start('dev:rootfiles');
    });

    // WATCH Templates
    watch(
        'src/templates/**/*.html',
        { name: 'WATCH Rootfiles', read: false },
        function() {
            gulp.start('dev:inject');
    });
});
