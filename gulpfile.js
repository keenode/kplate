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
var gutil 		= require('gulp-util'),
	requireDir 	= require('require-dir');

gutil.log(
	gutil.colors.bgCyan('----------------- kplate STARTED -----------------')
);

var dir = requireDir('./tasks');
