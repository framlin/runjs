var frBuilder = require('fr-builder'),
    PARTIALS_PATH = __dirname + '/../site/partials/',
    localPartials = frBuilder.loadAllPartials(PARTIALS_PATH);

module.exports = new frBuilder(localPartials);

