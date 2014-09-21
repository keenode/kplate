/** --------------------------------------------------------
	gulpfile.js
	--------------------------------------------------------
	@author Keenan Staffieri
	@version 0.0.1
	GulpJS Build tasks.
	-------------------------------------------------------- */

/**
	Gulp Modules
*/
var gulp 			= require('gulp'),
	angularFilesort = require('gulp-angular-filesort'), // needs to be used
	autoprefixer 	= require('gulp-autoprefixer'),
	concat 			= require('gulp-concat'),
	connect 		= require('gulp-connect'),
	imagemin 		= require('gulp-imagemin'),
	inject 			= require('gulp-inject'),
	jshint 			= require('gulp-jshint'),
	replace 		= require('gulp-replace'), // needs to be used
	rimraf 			= require('gulp-rimraf'),
	rubySass 		= require('gulp-ruby-sass'),
	size 			= require('gulp-size'),
	sourcemaps 		= require('gulp-sourcemaps'),
	stripDebug 		= require('gulp-strip-debug'),
	uglify 			= require('gulp-uglify'),
	gutil 			= require('gulp-util'),
	runSequence 	= require('run-sequence');

var logSep = ' *** ';

gutil.log(gutil.colors.bgCyan(logSep + 'Initializing kplate...' + logSep));

function logTaskStartup(logString) {
	gutil.log(gutil.colors.inverse(logSep + logString + logSep));
}

gulp.task('connect', function() {

	logTaskStartup('Startup connect server...');

	return connect.server({
		root: 'prod',
		livereload: true,
		port: 8000
	});
});

gulp.task('dev:css', function() {

	logTaskStartup('RUN TASK: CSS (development)...');

	return gulp.src('./src/scss/**/*.{scss,sass}')
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
		.pipe(gulp.dest('./dev/css'))
		.pipe(connect.reload());
});

gulp.task('prod:css', function() {

	logTaskStartup('RUN TASK: CSS (production)...');

	return gulp.src('./src/scss/**/*.{scss,sass}')
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
		.pipe(gulp.dest('./prod/css'))
		.pipe(connect.reload());
});

gulp.task('dev:js', function() {

	logTaskStartup('RUN TASK: JavaScript (development)...');

	return gulp.src('./src/scripts/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('maps'))
		.pipe(size({ title: 'JavaScript (uncompressed)' }))
		.pipe(gulp.dest('./dev/js'))
		.pipe(connect.reload());
});

gulp.task('prod:js', function() {

	logTaskStartup('RUN TASK: JavaScript (production)...');

	return gulp.src('./src/scripts/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.js'))
		.pipe(stripDebug())
		.pipe(uglify({
			mangle: true,
			compress: true,
			preserveComments: false // 'all'
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(size({ title: 'JavaScript (compressed)' }))
		.pipe(gulp.dest('./prod/js'))
		.pipe(connect.reload());
});

gulp.task('jshint', function() {

	logTaskStartup('RUN TASK: jshint...');

	return gulp.src('./src/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('dev:imagemin', function() {

	logTaskStartup('RUN TASK: imagemin (development)...');

	return gulp.src('./src/assets/images/**/*.{png,jpg,jpeg,gif,svg}')
		.pipe(imagemin({
			progressive: false, // (jpg)
			optimizationLevel: 3, // (png) (0-7 low-high)
			interlaced: false, // (gif)
			svgoPlugins: [{ removeViewBox: false }] // (svg)
		}))
		.pipe(gulp.dest('./dev/images'))
		.pipe(connect.reload());
});

gulp.task('prod:imagemin', function() {

	logTaskStartup('RUN TASK: imagemin (production)...');

	return gulp.src('./src/assets/images/**/*.{png,jpg,jpeg,gif,svg}')
		.pipe(imagemin({
			progressive: false, // (jpg)
			optimizationLevel: 7, // (png) (0-7 low-high)
			interlaced: false, // (gif)
			svgoPlugins: [{ removeViewBox: false }] // (svg)
		}))
		.pipe(gulp.dest('./prod/images'))
		.pipe(connect.reload());
});

// TODO: Perform different actions for angularjs projects...
gulp.task('inject', function() {

	logTaskStartup('RUN TASK: inject...');

	var target = gulp.src('./src/templates/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['css/**/*.css', 'js/**/*.js'], { read: false, cwd: 'src' });

	return target.pipe(inject(sources))
		.pipe(gulp.dest('./prod'));
});

gulp.task('dev:clear', function(cb) {

	logTaskStartup('RUN TASK: clear files (development)...');

	return gulp.src('./dev', { read: false })
		.pipe(rimraf());
});

gulp.task('prod:clear', function(cb) {

	logTaskStartup('RUN TASK: clear files (production)...');

	return gulp.src('./prod', { read: false })
		.pipe(rimraf());
});

gulp.task('watch-files', function(cb) {

	gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

	gulp.watch('src/scss/**/*.{scss,sass}', ['prod:css']);
	gulp.watch('src/scripts/**/*.js', ['prod:js']);
	gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif,svg}', ['dev:imagemin']);
	gulp.watch('src/templates/**/*.html', []);
});

gulp.task('default',
	function(cb) {

		runSequence(
			'dev:clear',
			['dev:css', 'jshint', 'dev:js', 'inject', 'dev:imagemin', 'connect'],
			'watch-files',
		cb);
});

gulp.task('prod',
	function(cb) {

		runSequence(
			'dev:clear',
			['prod:css', 'prod:js', 'inject', 'prod:imagemin'],
		cb);
});
