var frBuilder = require('fr-builder'),
    PARTIALS_PATH = __dirname + '/../site/partials/',
    localPartials = frBuilder.loadAllPartials(PARTIALS_PATH),
    fs = require('fs');

function runJSBuilder() {
    this.lib = function lib(router, libPath) {
        var libStream = fs.createReadStream(__dirname + '/../site/lib/' + libPath);
        libStream.pipe(router.res);
    };
    this.behave = function behave(router, behavePath) {
        var behaveStream = fs.createReadStream(__dirname + '/../site/behave/' + behavePath);
        behaveStream.pipe(router.res);
    };

}
runJSBuilder.prototype = new frBuilder(localPartials);

module.exports = new runJSBuilder();

