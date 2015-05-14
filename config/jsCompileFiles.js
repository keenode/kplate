/** --------------------------------------------------------
    config/jsCompileFiles.js
    --------------------------------------------------------
    @author Keenan Staffieri
    List of javascripts to inject into the main
    template. Order sometimes matters!
    -------------------------------------------------------- */

/**
    JavaScript files to compile.
    - This helps you specify which scripts you want in the
    build process and lets you put them in the correct
    order.
*/
var jsCompileFiles = [  // Placed before closing </body> tag
    '/**/jquery.js',
    '/**/jquery.*.js',
    '/**/*.js'
];

// Make jsCompileFiles available from require
module.exports = jsCompileFiles;
