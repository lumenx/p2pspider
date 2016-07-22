'use strict';

var P2PSpider = require('./lib');
var models = require('./models');

var p2p = P2PSpider({
    nodesMaxSize: 100,   // be careful
    maxConnections: 200, // be careful
    timeout: 5000
});

p2p.ignore(function (infohash, rinfo, callback) {
    // false => always to download the metadata even though the metadata is exists.
    var theInfohashIsExistsInDatabase = false;
    callback(theInfohashIsExistsInDatabase);
});

p2p.on('metadata', function (metadata) {
    
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

    var totalSize = 0;
    
    try {
    if (metadata.info.files) {
        metadata.info.files.forEach(function(file) {
            file.path.forEach(function(path) {
                files.push(path.toString());
            });
            totalSize = totalSize + file.length;
        });
    }else {
       totalSize = totalSize + metadata.info.length;
    }
    }
    catch(err){
       console.log(err);
    }                

    //Make sure you add the UNIQUE INDEX to the 'hash' column
    //This will keep laggy MySQL from allowing duplicate HashID's from multiple crawlers

    //ALTER IGNORE TABLE `Magnets` ADD UNIQUE INDEX (`hash`);

    models.Magnet.findOne({where: {hash: metadata.infohash}})
    .then(function(magnet) {
        if (magnet) {
            console.log('OLD - %s - %s', metadata.infohash, magnet.name);
            return magnet.increment('node_count', {by: 1});
        }
        console.log('NEW - %s - %s', metadata.infohash, metadata.info.name.toString());
        return models.Magnet.create({
            hash: metadata.infohash,
            name: metadata.info.name.toString(),
            files: JSON.stringify(files),
            size: totalSize,
            node_count: 1
        });
    })
    .catch(function(error) {
        console.log(error);
    });
});

models.sequelize.sync().then(function () {
    p2p.listen(6881, '0.0.0.0');
});
