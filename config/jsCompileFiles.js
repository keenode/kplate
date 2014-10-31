/** --------------------------------------------------------
    config/jsCompileFiles.js
    --------------------------------------------------------
    @author Keenan Staffieri
    List of javascripts to inject into the main
    template. Order sometimes matters!
    -------------------------------------------------------- */

/**
    JavaScript files to compile
    Array of bower resources.
*/
var jsCompileFiles = [
    '/**/jquery.js',
    '/**/jquery.*.js',
    '/**/MyClass.js',
    '/**/MyChildClass.js',
    '/**/*.js'
];

// Make jsCompileFiles available from require
module.exports = jsCompileFiles;
