#!/usr/bin/env node
// index.js
//http://stackoverflow.com/questions/4018154/node-js-as-a-background-service
//https://certsimple.com/blog/deploy-node-on-linux#node-linux-service-systemd
var db 		= require('./app/database')
var api 	= require('./app/api')
var user 	= require('./app/user')
var room 	= require('./app/room')
var server 	= require('./app/HTTPServer')
var chat 	= require('./app/chat') 

user = new user.User(db, server, api)
room = new room.Room(db, api)
chat = new chat.Chat(db, api, server)
api = new api.Api(user, room, chat)

server.startServer(db, user, api)


//user.register("email", "fname", "lname", "password")