const moment = require('moment');

function Server() {
  this.app = null;
  this.io = null;
  this.port = null;
  this._server = null;
};

Server.prototype.boundTo = function (port) {
  this.port = port;
  return this;
};

Server.prototype.usingApp = function (app) {
  this.app = app;
  return this;
};

Server.prototype.start = function () {

  this._server = require('http').Server(this.app).listen(this.port, () => {
    console.log("WebSocket Listening On %d", this.port);
  });

  this.io = require('socket.io')(this._server);

  this.io.on('message', (msg) => {
    //send message to all client

    //get current time
    var date = moment().utc('-8:00').toISOString();
    date = date.slice(0, 10) + ' ' + date.slice(11, 16);
    msg.time = date;

    this.io.emit('serverMessage', msg);
  });

  this.io.on('connection', function (socket) {

  });
};
module.exports = new Server();
