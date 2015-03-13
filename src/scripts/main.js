/** --------------------------------------------------------
    main.js
    --------------------------------------------------------
    @author Keenan Staffieri
    Main JavaScript file. Should serve as main entry point
    for the web application.
    -------------------------------------------------------- */

$('#about').on('click', function (e) {
    e.preventDefault();
    Stuff = require('./pages/test');
    var stuffz = new Stuff();
    stuffz.alertStuff();

    // bundle-loader
    var scriptName = 'about';
    // var load = require('bundle?lazy!./' + scriptName + '.js');
    var load = require('bundle?lazy!./pages/' + scriptName + '.js');

    // The chunk is not requested until you call the load function
    load(function (file) {
        console.log('file: ', file);
    });
});
