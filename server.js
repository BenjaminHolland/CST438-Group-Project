/*
Server.js
Server script for the project.
Starts 2 servers, 1 for serving the angular content and one for managing the chat relay.
NOTE:
I'm not super up on the object scope for javascript or how express handles apps/servers, and I don't have time to find
out. I THINK I could remove the references to the servers and be fine.
 */
const webPort=80;
const socketPort=3000;

const express=require('express');
const app = express();

//create and start the angular server
const angularServer=require('./server/ng-server')
  .boundTo(webPort)
  .usingApp(app)
  .usingExpress(express)
  .start();

//create and start the socket server
const socketServer=require('./server/socket-server')

  .boundTo(socketPort)
  .usingApp(app)
  .start();




