const net = require('net');
const Command = require('../src/Command');

var clients = [];

net.createServer(function (socket) {
  console.log('ACCEPT:   ' + socket.remoteAddress +':'+ socket.remotePort);
  //Push on the client array
  clients.push(socket);
  //When receive data
  socket.on('data', Command.dataHandler(socket));
  socket.on('error', function () {
    clients.splice(clients.indexOf(socket), 1);
  });
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    //When connection ends
  });
}).listen(8080);

Command.sendStatusInterval(clients)(10000);

console.log('Agendador server running at port 8080\n');
