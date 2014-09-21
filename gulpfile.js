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
	filter 			= require('gulp-filter'),
	imagemin 		= require('gulp-imagemin'),
	inject 			= require('gulp-inject'),
	jshint 			= require('gulp-jshint'),
	plumber 		= require('gulp-plumber'),
	replace 		= require('gulp-replace'), // needs to be used
	rimraf 			= require('gulp-rimraf'),
	rubySass 		= require('gulp-ruby-sass'),
	size 			= require('gulp-size'),
	sourcemaps 		= require('gulp-sourcemaps'),
	stripDebug 		= require('gulp-strip-debug'),
	uglify 			= require('gulp-uglify'),
	gutil 			= require('gulp-util'),
	runSequence 	= require('run-sequence');

/**
	buildConfig
	Configuration options for project build tasks.
*/
var buildConfig = {
	dev: {
		rootFolder: 'dev',
		paths: {
			css: './dev/css',
			js: './dev/js'
		},
		connectServer: {
			livereload: true,
			port: 8000
		}
	},
	prod: {
		rootFolder: 'prod',
		paths: {
			css: './prod/css',
			js: './prod/js'
		},
		connectServer: {
			livereload: true,
			port: 8000
		}
	},
	logSepDecor: ' *** ' // Logger decor separator for RUN TASK
};

gutil.log(
	gutil.colors.bgCyan('----------------- kplate STARTED -----------------')
);

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

/**
	TASK: dev:connect
	Start a new connect server with livereload support on development settings.
*/
gulp.task('dev:connect', function() {

	logTaskStartup('Startup connect server (development)...');

	return connect.server({
		root: 		buildConfig.dev.rootFolder,
		livereload: buildConfig.dev.connectServer.livereload,
		port: 		buildConfig.dev.connectServer.port
	});
});

/**
	TASK: prod:connect
	Start a new connect server with livereload support on production settings.
*/
gulp.task('prod:connect', function() {

	logTaskStartup('Startup connect server (production)...');

	return connect.server({
		root: 		buildConfig.prod.rootFolder,
		livereload: buildConfig.dev.connectServer.livereload,
		port: 		buildConfig.dev.connectServer.port
	});
});

/**
	TASK: dev:css
	Compile scss to css with ruby-sass with development settings.
*/
gulp.task('dev:css', function() {

	logTaskStartup('RUN TASK: CSS (development)...');

	return gulp.src('./src/scss/**/*.{scss,sass}')
		.pipe(plumber())
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
		.pipe(gulp.dest(buildConfig.dev.paths.css))
		.pipe(connect.reload());
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
	TASK: dev:js
	Copy full JavaScript files to corresponding development path.
*/
gulp.task('dev:js', function() {

	logTaskStartup('RUN TASK: JavaScript (development)...');

	return gulp.src('./src/scripts/**/*.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('maps'))
		.pipe(size({ title: 'JavaScript (uncompressed)' }))
		.pipe(gulp.dest(buildConfig.dev.paths.js))
		.pipe(connect.reload());
});

/**
	TASK: prod:js
	Concat, minify, and move final JavaScript files to corresponding production path.
*/
gulp.task('prod:js', function() {

	logTaskStartup('RUN TASK: JavaScript (production)...');

	return gulp.src('./src/scripts/**/*.js')
		.pipe(plumber())
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
		.pipe(gulp.dest(buildConfig.prod.paths.js))
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

	var imgFilter = filter('**/*.{png,jpg,jpeg,gif}'),
		svgFilter = filter('**/*.svg');

	return gulp.src(['./src/assets/images/**/*.{png,jpg,jpeg,gif}', './src/assets/svgs/**/*.svg'])
		.pipe(plumber())
		.pipe(imagemin({
			progressive: false, // (jpg)
			optimizationLevel: 3, // (png) (0-7 low-high)
			interlaced: false, // (gif)
			svgoPlugins: [{ removeViewBox: false }] // (svg)
		}))
		.pipe(imgFilter)
		.pipe(gulp.dest('./dev/images'))
		.pipe(imgFilter.restore())
		.pipe(svgFilter)
		.pipe(gulp.dest('./dev/svg'))
		.pipe(connect.reload());
});

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
		.pipe(gulp.dest('./prod/images'))
		.pipe(imgFilter.restore())
		.pipe(svgFilter)
		.pipe(gulp.dest('./prod/svg'))
		.pipe(connect.reload());
});

gulp.task('dev:inject', function() {

	logTaskStartup('RUN TASK: inject (development)...');

	var target = gulp.src('./src/templates/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['css/**/*.css', 'js/**/*.js', '!js/main.min.js'], { read: false, cwd: 'dev' });

	return target.pipe(inject(sources))
		.pipe(plumber())
		.pipe(gulp.dest('./dev'));
});

gulp.task('prod:inject', function() {

	logTaskStartup('RUN TASK: inject (production)...');

	var target = gulp.src('./src/templates/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['css/**/*.css', 'js/**/*.js'], { read: false, cwd: 'prod' });

	return target.pipe(inject(sources))
		.pipe(plumber())
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

gulp.task('dev:watch', function(cb) {

	gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

	gulp.watch('src/scss/**/*.{scss,sass}', ['dev:css']);
	gulp.watch('src/scripts/**/*.js', ['dev:js']);
	gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif,svg}', ['dev:imagemin']);
	gulp.watch('src/templates/**/*.html', []);
});

gulp.task('prod:watch', function(cb) {

	gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

	gulp.watch('src/scss/**/*.{scss,sass}', ['prod:css']);
	gulp.watch('src/scripts/**/*.js', ['prod:js']);
	gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif,svg}', ['prod:imagemin']);
	gulp.watch('src/templates/**/*.html', []);
});

gulp.task('default',
	function(cb) {

		gutil.log(gutil.colors.yellow.bold('Running DEVELOPMENT tasks...'));

		runSequence(
			'dev:clear',
			['dev:css', 'jshint', 'dev:js', 'dev:imagemin'],
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
			['prod:css', 'prod:js', 'prod:imagemin'],
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
			['dev:css', 'jshint', 'dev:js', 'dev:imagemin'],
			'dev:inject',
		cb);
});

gulp.task('build:prod',
	function(cb) {

		gutil.log(gutil.colors.blue.bold('Building PRODUCTION source...'));

		runSequence(
			'prod:clear',
			['prod:css', 'prod:js', 'prod:imagemin'],
			'prod:inject',
		cb);
});
