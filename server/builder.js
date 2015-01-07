var frBuilder = require('fr-builder'),
    partial = require('./partial'),
    homeHTML = partial.load('home'),
    topHTML = partial.load('top'),
    topnavHTML = partial.load('topnav'),
    bottomnavHTML = partial.load('bottomnav'),
    headingHTML = partial.load('heading');


function Builder() {
    var me = this;

    //overwrite framlin base CI
    this.partialIndex.top = topHTML;
    this.partialIndex.topnav = topnavHTML;
    this.partialIndex.heading = headingHTML;
    this.partialIndex.bottomnav = bottomnavHTML;

    /**
     * @callback: 'this' is the calling router
     */
    this.home = function home() {
        this.res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        this.res.write(me.partialIndex.top);
        this.res.write(me.partialIndex.heading);
        this.res.write(me.partialIndex.maintop);
        this.res.write(me.partialIndex.topnav);
        this.res.write(homeHTML);
        this.res.write(me.partialIndex.bottomnav);
        this.res.write(me.partialIndex.metanav);
        this.res.write(me.partialIndex.mainbottom);
        this.res.write(me.partialIndex.bottom);
        this.res.end();
    };
}

Builder.prototype = new frBuilder('runjs');

module.exports = new Builder();

