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
gulp.task('prod:watch', function (cb) {

    gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

    // WATCH SCSS
    gulp.watch('src/scss/**/*.{scss,sass}', ['prod:css']);

    // WATCH JavaScript
    gulp.watch('src/scripts/**/*.js', ['prod:js']);

    // WATCH Fonts
    gulp.watch('src/assets/fonts/**/*', ['prod:fonts']);

    // WATCH Images
    gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif}', ['prod:imagemin']);

    // WATCH SVGs
    gulp.watch('src/assets/svgs/**/*.svg', ['prod:imagemin']);

    // WATCH Videos
    gulp.watch('src/assets/videos/**/*.{mp4,ogv}', ['prod:videos']);

    // WATCH Favicons
    gulp.watch('src/favicons/**/*.{ico,png}', ['prod:favicons']);

    // WATCH Rootfiles
    gulp.watch('src/rootfiles/**/*', ['prod:rootfiles']);

    // WATCH Templates
    gulp.watch('src/templates/**/*.html', ['prod:html']);
});
