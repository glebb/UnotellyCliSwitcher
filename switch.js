var casper = require('casper').create();
var fs = require('fs');

var config = fs.read('config.yml').split(/\r\n|\r|\n/g);

if (config.length !== 3) {
    console.log("Invalid configuration format!");
    casper.exit();
}

var email = config[0];
var password = config[1];
var userId = config[2];

var countries = {
    'usa': 1,
    'can': 2,
    'gbr': 3,
    'irl': 5,
    'bra': 6,
    'mex': 8,
    'swe': 9,
    'nor': 18,
    'dnk': 19,
    'fin': 20,
    'nld': 27,
};

if (casper.cli.args.length !== 1) {
    console.log('Usage: casperjs switch.js CAN');
    casper.exit();
}

var countryName = casper.cli.args[0].toLowerCase();
var countryCode = countries[countryName];

if (typeof countryCode === 'undefined') {
    console.log('Invalid country name ' + countryName + '!');
    casper.exit();
}

casper.start('http://quickstart3.unotelly.com/login', function() {
    this.fill('form', {
        'email':      email,
        'password':   password
    }, true);
});

casper.thenOpen('http://quickstart3.unotelly.com/user/' + userId + '/dynamo', function () {
    this.fill('form', {
        '4':      countryCode + ''
    });
    
    console.log("Switched to " + countryName.toUpperCase() + ".");
});

casper.run();