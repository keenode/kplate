/** --------------------------------------------------------
    tasks/helpers.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Set of helper functions used throughout the build
    system.
    -------------------------------------------------------- */

/**
    Required Modules
*/
var gutil       = require('gulp-util'),
    buildConfig = require('../config/buildConfig');

var Helpers = {
    /**
        logTaskStartup
        - Formats and logs task startups
    */
    logTaskStartup: function(logString) {
        gutil.log(
            gutil.colors.inverse(
                buildConfig.logSepDecor + logString + buildConfig.logSepDecor
            )
        );
    }
};

// Make Helpers available from require
module.exports = Helpers;
