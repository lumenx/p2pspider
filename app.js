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
    //console.log(metadata);
    
    metadata.infohash;
    metadata.magnet;
    metadata.port;
    metadata.address;
    
    
    //array
    metadata.info.files;
    metadata.info.name;
    metadata.info['piece length'];
    metadata.info.pieces;

    var files = [];
    
    if (metadata.info.files) {
        metadata.info.files.forEach(function(file) {
            file.path.forEach(function(path) {
                files.push(path.toString());
            });
        });
    }

    models.Magnet.findOne({where: {hash: metadata.infohash}})
    .then(function(magnet) {
        if (magnet) {
            return magnet.increment('node_count', {by: 1});
        }
        return models.Magnet.create({
            hash: metadata.infohash,
            name: metadata.info.name.toString(),
            files: JSON.stringify(files),
            size: metadata.info['piece length'],
            node_count: 1
        });
    })
    .then(function(magnet) {
        console.log('fetched a magnet:%s', magnet.name);
    })
    .catch(function(error) {
        console.log(error);
    });
});

models.sequelize.sync().then(function () {
    p2p.listen(6881, '0.0.0.0');
});
