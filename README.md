##Introduction
p2pspider is a crawler combined with DHT Spider and BitTorrent Client.

It crawls what people are downloading on the worldwide DHT Network, and `metadata` (the core data of a torrent) from remote BitTorrent Clients. p2pspider also generates magnet URLs, you can import the URLs to your local BitTorrent Client in order to download the resources you want.

You can also use p2pspider to build your own torrents database(e.g: The Pirate Bay) for data mining and analyzing.

##Install
```

npm install
node app.js

```

##Usage

Before using this, please ensure your `node` version `>=0.12.0`.

```

##Protocols
[bep_0005](http://www.bittorrent.org/beps/bep_0005.html), [bep_0003](http://www.bittorrent.org/beps/bep_0003.html), [bep_0010](http://www.bittorrent.org/beps/bep_0010.html), [bep_0009](http://www.bittorrent.org/beps/bep_0009.html)

##Thanks
When I was developing this project, I referenced some code from [bittorrent-protocol](https://github.com/feross/bittorrent-protocol) and  [ut_metadata](https://github.com/feross/ut_metadata), thanks to their author,  [@feross](https://github.com/feross)'s pointing.

##Notice
Please don't share the data p2pspider crawled to the internet. Because sometimes it crawls sensitive/copyrighted/porn data.

##License
MIT
