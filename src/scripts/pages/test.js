// module.exports = 'Injected later...';
var Stuff = function () {

};

Stuff.prototype.alertStuff = function () {
    alert('Loaded script!');
};

module.exports = Stuff;
