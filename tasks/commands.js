/** --------------------------------------------------------
	tasks/commands.js
	--------------------------------------------------------
	@author Keenan Staffieri
	GulpJS commands to perform certain sets of tasks.
	-------------------------------------------------------- */

/**
	Required Modules
*/
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	runSequence = require('run-sequence');

/**
	Gulp Tasks - You may run these commands in the terminal:
	'gulp'				: Run 'development' mode tasks with WATCH.
	'gulp prod'			: Run 'production' mode tasks with WATCH.
	'gulp build:dev'	: Build 'development' folder.
	'gulp build:prod'	: Build 'production' folder.
*/
gulp.task('default',
	function(cb) {

		gutil.log(gutil.colors.yellow.bold('Running DEVELOPMENT tasks...'));

		runSequence(
			'dev:clear',
			['dev:css', 'jshint', 'dev:js', 'dev:imagemin', 'dev:videos', 'dev:fonts', 'dev:favicons', 'dev:rootfiles'],
			'dev:inject',
			'dev:connect',
			'dev:watch',
		cb);
});

gulp.task('prod',
	function(cb) {

		gutil.log(gutil.colors.yellow.bold('Running PRODUCTION tasks...'));

		runSequence(
			'prod:clear',
			['prod:css', 'prod:js', 'prod:imagemin', 'prod:videos', 'prod:fonts', 'prod:favicons', 'prod:rootfiles'],
			'prod:inject',
			'prod:connect',
			'prod:watch',
		cb);
});

gulp.task('build:dev',
	function(cb) {

		gutil.log(gutil.colors.blue.bold('Building DEVELOPMENT source...'));

		runSequence(
			'dev:clear',
			['dev:css', 'jshint', 'dev:js', 'dev:imagemin', 'dev:videos', 'dev:fonts', 'dev:favicons', 'dev:rootfiles'],
			'dev:inject',
		cb);
});

gulp.task('build:prod',
	function(cb) {

		gutil.log(gutil.colors.blue.bold('Building PRODUCTION source...'));

		runSequence(
			'prod:clear',
			['prod:css', 'prod:js', 'prod:imagemin', 'prod:videos', 'prod:fonts', 'prod:favicons', 'prod:rootfiles'],
			'prod:inject',
		cb);
});
