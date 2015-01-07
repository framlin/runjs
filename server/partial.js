var fs = require('fs');

const PARTIALS_PATH = '/../site/partials/';
const PARTIALS_POSTFIX = '.html';

function load(partial) {
    var content = fs.readFileSync(__dirname + PARTIALS_PATH + partial + PARTIALS_POSTFIX, {encoding: 'utf-8'});

    return content;
}



module.exports = {
    load: load
};