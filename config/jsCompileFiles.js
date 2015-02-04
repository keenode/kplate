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
    '/**/MyClass.js',
    '/**/MyChildClass.js',
    '/**/*.js'
];

// TODO: Add compile scripts for <head>
// var jsCompileFilesHead = [ // Placed within <head>
//     '/**/MyClass.js',
//     '/**/MyChildClass.js'
// ];

// Make jsCompileFiles available from require
module.exports = jsCompileFiles;

// TODO: Add compile scripts for <head>
// module.exports = jsCompileFilesHead;
