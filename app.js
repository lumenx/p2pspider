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
    
    metadata.infohash;
    metadata.magnet;
    metadata.port;
    metadata.address;
    metadata.pieces;
    metadata['piece length'];
    //array
    metadata.info.files;
    metadata.info.name;
    models.Magnet.create({
        hash: metadata.infohash,
        name: metadata.info.name.toString(),
        files: '',
        size: metadata['piece length']
    })
    .then(function(magnet) {
        console.log('fetched a magnet:%s', magnet.name);
    });
});

models.sequelize.sync().then(function () {
    p2p.listen(6881, '0.0.0.0');
});
