const fs = require('fs')
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/lib',express.static('lib'))
app.use('/utils', express.static('utils'))
app.use('/vue', express.static('vue'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
let socketUser = null
let fileName = __dirname + '/components/test.vue'
function sendStream () {
  if (socketUser) {
    fs.readFile(fileName, 'utf-8' ,(err, data) => {
      if (err) throw err
      socketUser.emit('setCode', data);
    } )
  }
}
fs.watchFile(fileName, (cur, prev) => {
  sendStream()
})
io.on('connection', (socket) => {
  socket.on('ready', () => {
    socketUser = socket
    sendStream()
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});