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

/**
	Include gulp tasks
	------------------
	./tasks/dev.js
	./tasks/prod.js
	./tasks/commands.js
*/
var dir = requireDir('./tasks');
