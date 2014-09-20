/** --------------------------------------------------------
	gulpfile.js
	--------------------------------------------------------
	@author Keenan Staffieri
	@version 0.0.1
	GulpJS Build tasks.
	-------------------------------------------------------- */

var gulp 			= require('gulp'),//
	angularFilesort = require('gulp-angular-filesort'),
	autoprefixer 	= require('gulp-autoprefixer'),//
	concat 			= require('gulp-concat'),//
	connect 		= require('gulp-connect'),//
	imagemin 		= require('gulp-imagemin'),//
	inject 			= require('gulp-inject'),//
	jshint 			= require('gulp-jshint'),//
	rename 			= require('gulp-rename'),
	replace 		= require('gulp-replace'),
	rimraf 			= require('gulp-rimraf'),
	rubySass 		= require('gulp-ruby-sass'),//
	size 			= require('gulp-size'),//
	sourcemaps 		= require('gulp-sourcemaps'),//
	stripDebug 		= require('gulp-strip-debug'),//
	uglify 			= require('gulp-uglify'),//
	util 			= require('gulp-util'),
	watch 			= require('gulp-watch');

/*
	Use '.pipe(connect.reload());' to reload the website
*/
gulp.task('connect', function() {
	return connect.server({
		root: 'app',
		livereload: true,
		port: 8000
	});
});

gulp.task('build:css', function() {
	return gulp.src('app/scss/**/*.{scss,sass}')
		.pipe(rubySass({
			style: 'compressed', // nested, compact, compressed, expanded
			lineNumbers: false // Emit comments in the generated CSS indicating the corresponding source line.
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.on('error', function(err) { console.log(err.message); })
		.pipe(size({ title: 'CSS' }))
		.pipe(gulp.dest('app/css'));
});

gulp.task('build:js', function() {
	return gulp.src('app/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('main.min.js'))
		.pipe(stripDebug())
		.pipe(uglify({
			mangle: true,
			compress: true,
			preserveComments: false // 'all'
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(size({ title: 'JavaScript' }))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('jshint', function() {
	return gulp.src('app/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('imagemin', function() {
	return gulp.src('app/images/**/*.{png,jpg,jpeg,gif,svg}')
		.pipe(imagemin({
			progressive: false, // (jpg)
			optimizationLevel: 3, // (png) (0-7 low-high)
			interlaced: false, // (gif)
			svgoPlugins: [{ removeViewBox: false }] // (svg)
		}))
		.pipe(gulp.dest('dist/images'));
});

// TODO: Perform different actions for angularjs projects...
gulp.task('index', function() {
	var target = gulp.src('app/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['app/css/**/*.css', 'app/js/**/*.js'], { read: false });

	return target.pipe(inject(sources))
	.pipe(gulp.dest('app'));
});

gulp.task('default', ['build:css', 'build:js', 'connect']);
