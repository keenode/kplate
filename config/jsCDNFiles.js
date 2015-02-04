/** --------------------------------------------------------
    config/jsCDNFiles.js
    --------------------------------------------------------
    @author Keenan Staffieri
    List of javascripts to replace with corresponding
    CDN locations.
    -------------------------------------------------------- */

/**
    JavaScript files to replace with CDN path.
    - This helps you specify which scripts you want to use a
    CDN location for. Note: CDN scripts are only used in
    production mode.
*/
var jsCDNFiles = [
    {
        filePath: './src/bower_components/jquery/dist/jquery.js',
        cdnPath:  '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js'
    }
];

// Make jsCDNFiles available from require
module.exports = jsCDNFiles;
