/** --------------------------------------------------------
	gulpfile.js
	--------------------------------------------------------
	@author Keenan Staffieri
	@version 0.0.1
	GulpJS build tasks for kplate.
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
		rootFolder: './dev',
		paths: {
			css: 	'./dev/css',
			js: 	'./dev/js',
			images: './dev/images',
			svgs: 	'./dev/svgs',
			videos: './dev/videos',
			fonts: 	'./dev/fonts'
		},
		connectServer: {
			livereload: true,
			port: 	8000
		}
	},
	prod: {
		rootFolder: './prod',
		paths: {
			css: 	'./prod/css',
			js: 	'./prod/js',
			images: './prod/images',
			svgs: 	'./prod/svgs',
			videos: './prod/videos',
			fonts: 	'./prod/fonts'
		},
		connectServer: {
			livereload: true,
			port: 8000
		},
		jsMangle: true,
		jsComments: false, // false or 'all'
		mainJsFileName: 'main'
	},
	logSepDecor: ' *** ' // Logger decor separator for RUN TASK
};

var bowerComponentsPath = './src/bower_components',
	bowerComponents = [
		bowerComponentsPath + '/jquery/dist/jquery.js'
	];

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

	var jsCompileArr = bowerComponents.concat(
		[
			'./src/scripts/**/*.js',
			'!./src/scripts/' + buildConfig.prod.mainJsFileName + '.min.js'
		]);

	return gulp.src(jsCompileArr)
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

	var jsCompileArr = bowerComponents.concat(
		[
			'./src/scripts/**/*.js'
		]);

	return gulp.src(jsCompileArr)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat(buildConfig.prod.mainJsFileName + '.min.js'))
		.pipe(stripDebug())
		.pipe(uglify({
			mangle: buildConfig.prod.jsMangle,
			compress: true,
			preserveComments: buildConfig.prod.jsComments
		}))
		.pipe(sourcemaps.write('maps'))
		.pipe(size({ title: 'JavaScript (compressed)' }))
		.pipe(gulp.dest(buildConfig.prod.paths.js))
		.pipe(connect.reload());
});

/**
	TASK: jshint
	jshint JavaScript files.
*/
gulp.task('jshint', function() {

	logTaskStartup('RUN TASK: jshint...');

	return gulp.src('./src/scripts/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});


/**
	TASK: dev:imagemin
	Apply image and SVG minification on development settings.
*/
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
		.pipe(gulp.dest(buildConfig.dev.paths.images))
		.pipe(imgFilter.restore())
		.pipe(svgFilter)
		.pipe(gulp.dest(buildConfig.dev.paths.svgs))
		.pipe(connect.reload());
});

/**
	TASK: dev:imagemin
	Apply image and SVG minification on production settings.
*/
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
		.pipe(gulp.dest(buildConfig.prod.paths.images))
		.pipe(imgFilter.restore())
		.pipe(svgFilter)
		.pipe(gulp.dest(buildConfig.prod.paths.svgs))
		.pipe(connect.reload());
});

/**
	TASK: dev:inject
	Inject all CSS and JavaScript into index.html document.
*/
gulp.task('dev:inject', function() {

	logTaskStartup('RUN TASK: inject (development)...');

	var target = gulp.src('./src/templates/**/*.html');

	// get css and js folder names
	var cssPath = buildConfig.dev.paths.css,
		jsPath = buildConfig.dev.paths.js,
		cssFolderName = cssPath.split('/').pop(),
		jsFolderName = jsPath.split('/').pop();

	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(
		[
			cssFolderName + '/**/*.css',
			jsFolderName + '/**/*.js',
			'!' + jsFolderName + '/' + buildConfig.prod.mainJsFileName + '.min.js'
		],
		{
			read: false,
		  	cwd: buildConfig.dev.rootFolder
	 	});

	return target.pipe(inject(sources))
		.pipe(plumber())
		.pipe(gulp.dest(buildConfig.dev.rootFolder))
		.pipe(connect.reload());
});

/**
	TASK: prod:inject
	Inject minified CSS and JavaScript into index.html document.
*/
gulp.task('prod:inject', function() {

	logTaskStartup('RUN TASK: inject (production)...');

	var target = gulp.src('./src/templates/**/*.html');

	// get css and js folder names
	var cssPath = buildConfig.prod.paths.css,
		jsPath = buildConfig.prod.paths.js,
		cssFolderName = cssPath.split('/').pop(),
		jsFolderName = jsPath.split('/').pop();

	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(
		[
			cssFolderName + '/**/*.css',
			jsFolderName + '/**/*.js'
		],
		{
			read: false,
			cwd: buildConfig.prod.rootFolder
		});

	return target.pipe(inject(sources))
		.pipe(plumber())
		.pipe(gulp.dest(buildConfig.prod.rootFolder))
		.pipe(connect.reload());
});

/**
	TASK: dev:clear
	Delete the development folder.
*/
gulp.task('dev:clear', function(cb) {

	logTaskStartup('RUN TASK: clear files (development)...');

	return gulp.src(buildConfig.dev.rootFolder, { read: false })
		.pipe(rimraf());
});

/**
	TASK: prod:clear
	Delete the production folder.
*/
gulp.task('prod:clear', function(cb) {

	logTaskStartup('RUN TASK: clear files (production)...');

	return gulp.src(buildConfig.prod.rootFolder, { read: false })
		.pipe(rimraf());
});

/**
	TASK: dev:videos
	Copy videos to development folder.
*/
gulp.task('dev:videos', function() {

	logTaskStartup('RUN TASK: copy videos (development)...');

	return gulp.src('./src/assets/videos/**/*.{mp4,ogv}')
		.pipe(gulp.dest(buildConfig.dev.paths.videos));
});

/**
	TASK: prod:videos
	Copy videos to production folder.
*/
gulp.task('prod:videos', function() {

	logTaskStartup('RUN TASK: copy videos (production)...');

	return gulp.src('./src/assets/videos/**/*.{mp4,ogv}')
		.pipe(gulp.dest(buildConfig.prod.paths.videos));
});

/**
	TASK: dev:fonts
	Copy fonts to development folder.
*/
gulp.task('dev:fonts', function() {

	logTaskStartup('RUN TASK: copy fonts (development)...');

	return gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest(buildConfig.dev.paths.fonts));
});

/**
	TASK: prod:fonts
	Copy fonts to production folder.
*/
gulp.task('prod:fonts', function() {

	logTaskStartup('RUN TASK: copy fonts (production)...');

	return gulp.src('./src/assets/fonts/**/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest(buildConfig.prod.paths.fonts));
});

/**
	TASK: dev:favicons
	Copy favicons to development folder.
*/
gulp.task('dev:favicons', function() {

	logTaskStartup('RUN TASK: copy favicons (development)...');

	return gulp.src('./src/favicons/**/*.{ico,png}')
		.pipe(gulp.dest(buildConfig.dev.rootFolder));
});

/**
	TASK: prod:favicons
	Copy favicons to production folder.
*/
gulp.task('prod:favicons', function() {

	logTaskStartup('RUN TASK: copy favicons (production)...');

	return gulp.src('./src/favicons/**/*.{ico,png}')
		.pipe(gulp.dest(buildConfig.prod.rootFolder));
});

/**
	TASK: dev:rootfiles
	Copy rootfiles to development folder.
*/
gulp.task('dev:rootfiles', function() {

	logTaskStartup('RUN TASK: copy rootfiles (development)...');

	return gulp.src('./src/rootfiles/**/*')
		.pipe(gulp.dest(buildConfig.dev.rootFolder));
});

/**
	TASK: prod:rootfiles
	Copy rootfiles to production folder.
*/
gulp.task('prod:rootfiles', function() {

	logTaskStartup('RUN TASK: copy rootfiles (production)...');

	return gulp.src('./src/rootfiles/**/*')
		.pipe(gulp.dest(buildConfig.prod.rootFolder));
});

/**
	TASK: dev:watch
	Watch files in development mode and run only the necessary tasks when certain file types change.
*/
gulp.task('dev:watch', function(cb) {

	gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

	gulp.watch('src/scss/**/*.{scss,sass}', 					['dev:css']);
	gulp.watch('src/scripts/**/*.js', 							['jshint', 'dev:js']);
	gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif}', 	['dev:imagemin']);
	gulp.watch('src/assets/svgs/**/*.svg',					 	['dev:imagemin']);
	gulp.watch('src/assets/videos/**/*.{mp4,ogv}', 				['dev:videos']);
	gulp.watch('src/favicons/**/*.{ico,png}', 					['dev:favicons']);
	gulp.watch('src/rootfiles/**/*', 							['dev:rootfiles']);
	gulp.watch('src/templates/**/*.html', 						['dev:inject']);
});

/**
	TASK: prod:watch
	Watch files in production mode and run only the necessary tasks when certain file types change.
*/
gulp.task('prod:watch', function(cb) {

	gutil.log(gutil.colors.bgMagenta.white.bold('Watching files...'));

	gulp.watch('src/scss/**/*.{scss,sass}', 					['prod:css']);
	gulp.watch('src/scripts/**/*.js', 							['prod:js']);
	gulp.watch('src/assets/images/**/*.{png,jpg,jpeg,gif}', 	['prod:imagemin']);
	gulp.watch('src/assets/svgs/**/*.svg',					 	['prod:imagemin']);
	gulp.watch('src/assets/videos/**/*.{mp4,ogv}', 				['prod:videos']);
	gulp.watch('src/favicons/**/*.{ico,png}', 					['prod:favicons']);
	gulp.watch('src/rootfiles/**/*', 							['prod:rootfiles']);
	gulp.watch('src/templates/**/*.html', 						['prod:inject']);
});

/**
	Gulp Tasks - run these commands in the terminal:
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
