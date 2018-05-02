const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const moment=require('moment');
const staticPath = __dirname + '/dist';

console.debug(`Server Running In ${__dirname}`);
console.debug(`Server Serving From ${staticPath}`)
app.use(express.static(staticPath));
io.on('connection', socket => {
  console.log('connected')
  socket.on('message', msg => {
    console.log(`got a message: ${msg}`);
    var date = moment().utc('-8:00').toISOString();
    date = date.slice(0, 10) + ' ' + date.slice(11, 16);
    msg.time = date;
    io.emit('serverMessage', msg);
  });
});
server.listen(process.env.PORT||80);
