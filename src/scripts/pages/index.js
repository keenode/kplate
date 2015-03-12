// document.write(require('./about'));

// setTimeout(function () {
//     console.log(require('./test'));
// }, 3000);

$('#about').on('click', function (e) {
    e.preventDefault();
    Stuff = require('./test');
    var stuffz = new Stuff();
    stuffz.alertStuff();
});
