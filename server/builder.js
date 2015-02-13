var frBuilder = require('fr-builder'),
    PARTIALS_PATH = __dirname + '/../site/partials/',
    localPartialUrls = frBuilder.listAllPartials(PARTIALS_PATH);

module.exports = new frBuilder(localPartialUrls);

