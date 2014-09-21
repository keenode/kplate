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

module.exports = buildConfig;
