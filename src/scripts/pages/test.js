// module.exports = 'Injected later...';
var Stuff = function () {

};

Stuff.prototype.alertStuff = function () {
    console.log('Loaded test script!');
};

module.exports = Stuff;
