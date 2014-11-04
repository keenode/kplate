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
    gutil = require('gulp-util');

/**
    TASK: dev:watch
    Watch files in development mode and run only the necessary tasks when certain file types change.
*/
gulp.task('dev:watch', function(cb) {

    gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

    // WATCH SCSS
    gulp.watch('src/scss/**/*.{scss,sass}', ['dev:css'])

    // WATCH JavaScript
    gulp.watch('src/scripts/**/*.js', ['jshint', 'dev:js']);

    // WATCH Fonts
    gulp.watch('src/assets/fonts/**/*', ['dev:fonts']);

    // WATCH Images
    gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif}', ['dev:imagemin']);

    // WATCH SVGs
    gulp.watch('src/assets/svgs/**/*.svg', ['dev:imagemin']);

    // WATCH Videos
    gulp.watch('src/assets/videos/**/*.{mp4,ogv}', ['dev:videos']);

    // WATCH Favicons
    gulp.watch('src/favicons/**/*.{ico,png}', ['dev:favicons']);

    // WATCH Rootfiles
    gulp.watch('src/rootfiles/**/*', ['dev:rootfiles']);

    // WATCH Templates
    gulp.watch('src/templates/**/*.html', ['dev:inject']);
});
