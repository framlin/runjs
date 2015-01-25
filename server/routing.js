var frRouting = require('fr-routing');


function configureRouter(sitename, router, builder, next) {
    frRouting.configure(router, builder);
    builder.loadContent(sitename, next);

}


module.exports = {
    configure: configureRouter
};