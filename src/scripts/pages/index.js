// document.write(require('./about'));

// setTimeout(function () {
//     console.log(require('./test'));
// }, 3000);

$('#about').on('click', function (e) {
    e.preventDefault();
    Stuff = require('./test');
    var stuffz = new Stuff();
    stuffz.alertStuff();

    // bundle-loader
    var scriptName = 'about';
    var load = require('bundle?lazy!./' + scriptName + '.js');
    // var load = require('bundle?lazy!./pages/' + scriptName + '.js');

    // The chunk is not requested until you call the load function
    load(function (file) {
        console.log('file: ', file);
    });
});
