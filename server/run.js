var union = require('union'),
    director = require('director'),
    flatiron = require('flatiron'),
    ecstatic = require('ecstatic'),
    webserver = new flatiron.App(),
    ServerPort = require('fr-infra').ServerConfig.runjs.port,
    router = new director.http.Router(),
    routing = require('./routing');





function RESTDispatcher(req, res) {
    if (!router.dispatch(req, res)) {
        res.emit('next');
    }
}

//--------- RUN ---------------------------
webserver.use(flatiron.plugins.http);
webserver.http.before = [
    RESTDispatcher,
    ecstatic(__dirname + '/../site')
];

routing.configure(router, function cbConfigured() {
    webserver.start(ServerPort);
});






