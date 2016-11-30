#!/usr/bin/env node
// index.js
//http://stackoverflow.com/questions/4018154/node-js-as-a-background-service
//https://certsimple.com/blog/deploy-node-on-linux#node-linux-service-systemd
require('./app/index')  
var db 		= require('./app/database')
var api 	= require('./app/api')
var user 	= require('./app/user')
var server 	= require('./app/HTTPServer')

api = new api.Api(db,server)
user = new user.User(db, server)

server.startServer(db, user)


//user.register("email", "fname", "lname", "password")