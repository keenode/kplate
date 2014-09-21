var gutil = require('gulp-util');

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
