var frRouting = require('fr-routing'),
    builder = require('./builder');


function nodejs() {
    builder.nodejs(this);
}


function configureRouter(router, cbDone) {
    frRouting.configure(router, builder);

    //router.get('/co/runjs/article/nodejs', nodejs);

    builder.loadContent(cbDone);
}


module.exports = {
    configure: configureRouter
};