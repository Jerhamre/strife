#!/usr/bin/env node
// index.js
//http://stackoverflow.com/questions/4018154/node-js-as-a-background-service
//https://certsimple.com/blog/deploy-node-on-linux#node-linux-service-systemd
require('./app/index')  
require('./app/database')
require('./app/HTTPServer')
