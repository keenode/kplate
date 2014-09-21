/** --------------------------------------------------------
	gulpfile.js
	--------------------------------------------------------
	@author Keenan Staffieri
	@version 0.1.0
	GulpJS build tasks for kplate.
	-------------------------------------------------------- */

/**
	Required Modules
*/
var gutil 		= require('gulp-util'),
	requireDir 	= require('require-dir');

gutil.log(
	gutil.colors.bgCyan('----------------- kplate STARTED -----------------')
);

var dir = requireDir('./tasks');
