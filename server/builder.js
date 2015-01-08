var frBuilder = require('fr-builder'),
    PARTIALS_PATH = __dirname + '/../site/partials/',
    partialCache = frBuilder.loadAllPartials(PARTIALS_PATH);


function Builder() {
    var partial;

    //overwrite framlin base CI
    for (partial in partialCache) {
        this.partialIndex[partial] = partialCache[partial];
    }

}

Builder.prototype = new frBuilder('runjs');

module.exports = new Builder();

