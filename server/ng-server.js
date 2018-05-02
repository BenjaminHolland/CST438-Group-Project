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
  const staticPath=__dirname + '/../dist';
  console.debug(`Angular Server Running In ${__dirname}`);
  console.debug(`Angular Server Serving From ${staticPath}`)
  this.app.use(this.express.static(staticPath));
  return (this._server = this.app.listen(this.port, () => {
    console.log(`Angular Server Listening On ${this.port}`);
  }));
};
module.exports = new Server();
