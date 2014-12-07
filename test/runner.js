var path = require('path');
var require = require('requirejs');

require.config({
    paths: {
        lib: path.resolve(__dirname, '../src/scripts/lib')
    }
});

require(['mocha', 'fs', 'path'], function(Mocha, fs, path) {
    var mocha = new Mocha;

    fs.readdirSync(__dirname).filter(function(file) {
        return file.substr(-7) === 'spec.js';
    }).forEach(function(file) {
        mocha.addFile(path.resolve(__dirname, file));
    });

    mocha.run(function(failures) {
        process.on('exit', function() {
            process.exit(failures);
        });
    });
    
});
