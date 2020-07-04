# proxy configuration 

the proxy configuration is used mostly using process env variables:

* `PORT` - default port to use
* `WEBSITE_HOSTNAME` - the local host to use
* `GGS_CLUSTER_MASTER` - the cluster master to use to get endpoints to forward to
* `SSL_FOLDER` - a folder for key.pem and cert.pem files. will create https endpoint instead of http
* `SSL_PASSPHRASE` - allow you to use secure cert.pfx at SSL_FOLDER
* `PROXY_TARGETS` - you can pass a geojson for targets if no cluster is active: {"api",["http://localhost:1234],"view":["http://localhost:2345"],"*":["http://localhost:8080"]};

## Credits 
Global Grid Systems