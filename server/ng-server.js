function Server(){
  this.port = null;
  this.app = null;
  this.express = null;
  this._server = null;
};

Server.prototype.boundTo = function(port) {
  this.port = port;
  return this;
};
Server.prototype.usingApp = function(app)  {
  this.app = app;
  return this;
};
Server.prototype.usingExpress = function(express) {
  this.express = express;
  return this;
};
Server.prototype.start = function() {
  this.app.use(this.express.static(__dirname + '/../dist'));
  return (this._server = this.app.listen(this.port, () => {
    console.log("Web Port Listening On %d", this.port);
  }));
};
module.exports = new Server();
