/** --------------------------------------------------------
	gulpfile.js
	--------------------------------------------------------
	@author Keenan Staffieri
	@version 0.0.1
	GulpJS Build tasks.
	-------------------------------------------------------- */

var gulp 			= require('gulp'),//
	autoprefixer 	= require('gulp-autoprefixer'),
	changed 		= require('gulp-changed'),
	concat 			= require('gulp-concat'),//
	connect 		= require('gulp-connect'),//
	imageMin 		= require('gulp-imagemin'),
	inject 			= require('gulp-inject'),
	jshint 			= require('gulp-jshint'),
	rename 			= require('gulp-rename'),
	replace 		= require('gulp-replace'),
	rimraf 			= require('gulp-rimraf'),
	rubySass 		= require('gulp-ruby-sass'),//
	size 			= require('gulp-size'),
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
		.on('error', function (err) { console.log(err.message); })
		.pipe(gulp.dest('dist/css'));
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
		.pipe(gulp.dest('dist/js'));
});

gulp.task('default', ['build:css', 'build:js', 'connect']);
