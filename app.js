'use strict';

var elasticsearch = require('elasticsearch');
var moment = require('moment');
var P2PSpider = require('./lib');

var index = 'INDEX_NAME';
var type = 'seed';

//Be careful here... Will easily overload your system!
var myMaxNodes = 200; //200 is the default initial, play with it to find your happy place!
var myMaxConnections = 400; //400 is the default initial, play with it to find your happy place!

var es = new elasticsearch.Client({
    host: 'HOSTNAME:PORT',
    log: 'info'
});

var p2p = P2PSpider({
    nodesMaxSize: myMaxNodes,
    maxConnections: myMaxConnections,
    timeout: 5000 //If you have a very fast network, take down to 1000 and increment by 1000 until you get a steady stream of data coming in!
});

//Use the following elasticsearch configuration values in order to run the updating script!
//Add to the elasticsearch.yml
//
//script.inline: on
//script.indexed: on
//script.engine.groovy.inline.aggs: on
//script.engine.groovy.inline.update: on
p2p.ignore(function (infohash, rinfo, callback) {

    es.get({
        index: index,
        type: type,
        id: infohash
    })
    .then(function(res) {
        return es.update({
            index: index,
            type: type,
            id: infohash,
            body: {
                script: 'ctx._source.peer_counter += peer',
                params: {
                    peer: 1
                }
            }
        });
    })
    .then(function(res) {
       //console.log('Peer Count Increased - %s', infohash);
       callback(true);
    })
    .catch(function(err, res) {
        if (err.status && err.status == 404) {
            callback(false);
        } else {
            console.err(err);
            //process.exit(1);
        }
    });

});

p2p.on('metadata', function (metadata) {

    var files = [];
    var totalLength = 0;

    try{
       if (metadata.info.files) {
           metadata.info.files.forEach(function(file) {
               file.path = file.path.toString();
               files.push({length: file.length, path: file.path});
               totalLength += file.length;
           });
       } else {
           totalLength = metadata.info.length;
           files.push({length: metadata.info.length, path: metadata.info.name.toString()});
       }

       es.create({
           index: index,
           type: type,
           id: metadata.infohash,
           body: {
               name: metadata.info.name.toString(),
               files: JSON.stringify(files),
               length: totalLength,
               peer_counter: 1,
               created_at: (new Date())
           }
       })
       .then(function(res) {
          console.log('NEW - %s - %s', metadata.infohash, metadata.info.name.toString());
       })
       .catch(function(err) {
          //console.log(err);
       });
    }
    catch(err){
       //console.log(err);
    }
    
});

p2p.listen(6881, '0.0.0.0');
