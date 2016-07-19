'use strict';

var P2PSpider = require('./lib');
var models = require('./models');

var p2p = P2PSpider({
    nodesMaxSize: 200,   // be careful
    maxConnections: 400, // be careful
    timeout: 5000
});

p2p.ignore(function (infohash, rinfo, callback) {
    // false => always to download the metadata even though the metadata is exists.
    var theInfohashIsExistsInDatabase = false;
    callback(theInfohashIsExistsInDatabase);
});

p2p.on('metadata', function (metadata) {
    console.log(metadata);
    /*models.Magnet.create({
        hash: 'dslkfjdslfsd',
        name: 'djflds',
        files: 'sdfdsfds',
        size: 33243
    })
    .then(function(magnet) {
        console.log('fetched a magnet:%s', metadata.info.name.toString());
    });*/
});

models.sequelize.sync().then(function () {
    p2p.listen(6881, '0.0.0.0');
});
