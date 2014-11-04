/** --------------------------------------------------------
    tasks/prod-watch.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Watch task for production mode.
    -------------------------------------------------------- */

/**
    Required Modules
*/
var gulp  = require('gulp'),
    gutil = require('gulp-util');

/**
    TASK: prod:watch
    Watch files in production mode and run only the necessary tasks when certain file types change.
*/
gulp.task('prod:watch', function(cb) {

    gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

    // WATCH SCSS
    // watch(
    //     'src/scss/**/*.{scss,sass}',
    //     { name: 'WATCH SCSS', read: false },
    //     function() {
    //         gulp.start('prod:css');
    // });

    // WATCH JavaScript
    // watch(
    //     'src/scripts/**/*.js',
    //     { name: 'WATCH JavaScript', read: false },
    //     function() {
    //         gulp.start('prod:js');
    // });

    // WATCH Fonts
    // watch(
    //     'src/assets/fonts/**/*',
    //     { name: 'WATCH Fonts', read: false },
    //     function() {
    //         gulp.start('prod:fonts');
    // });

    // WATCH Images
    // watch(
    //     'src/assets/images/**/*.{png,jpg,jpeg,gif}',
    //     { name: 'WATCH Images', read: false },
    //     function() {
    //         gulp.start('prod:imagemin');
    // });

    // WATCH SVGs
    // watch(
    //     'src/assets/svgs/**/*.svg',
    //     { name: 'WATCH SVGs', read: false },
    //     function() {
    //         gulp.start('prod:imagemin');
    // });

    // WATCH Videos
    // watch(
    //     'src/assets/videos/**/*.{mp4,ogv}',
    //     { name: 'WATCH Videos', read: false },
    //     function() {
    //         gulp.start('prod:videos');
    // });

    // WATCH Favicons
    // watch(
    //     'src/favicons/**/*.{ico,png}',
    //     { name: 'WATCH Favicons', read: false },
    //     function() {
    //         gulp.start('prod:favicons');
    // });

    // WATCH Rootfiles
    // watch(
    //     'src/rootfiles/**/*',
    //     { name: 'WATCH Rootfiles', read: false },
    //     function() {
    //         gulp.start('prod:rootfiles');
    // });

    // WATCH Templates
    // watch(
    //     'src/templates/**/*.html',
    //     { name: 'WATCH Rootfiles', read: false },
    //     function() {
    //         gulp.start('prod:inject');
    // });
});
