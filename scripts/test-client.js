const net = require('net');
const StatusRoom = require('../src/StatusRoom');
const Command = require('../src/Command');

const COMMAND_REGISTER = 1;
const COMMAND_RESERVE  = 2;
const COMMAND_STATUS   = 3;

var client = new net.Socket();

console.log('CONNECT:  localhost:8080');
client.connect(8080, 'localhost', function() {
  const sendBuffer = Buffer.from([Command.REGISTER, 2], 2);
  console.log('SEND:     COMMAND_REGISTER(2)', sendBuffer);
	client.write(sendBuffer);
});

client.on('data', function(buffer) {
  const command = buffer[0];
  const param = buffer[1];

  let sendBuffer;

  switch (command) {
    case Command.STATUS:
      switch (param) {
        case StatusRoom.UNDEFINED:
          console.log('RECEIVED: COMMAND_STATUS(UNDEFINED)', buffer);
          break;
        case StatusRoom.FREE:
          console.log('RECEIVED: COMMAND_STATUS(FREE)', buffer);
          sendBuffer = Buffer.from([Command.RESERVE, 0], 2);
          console.log('SEND:     RESERVE(0)', sendBuffer);
          client.write(sendBuffer);
          break;
        case StatusRoom.IN_MEETING:
          console.log('RECEIVED: COMMAND_STATUS(IN_MEETING)', buffer);
          break;
        case StatusRoom.IN_MEETING_SOON:
          console.log('RECEIVED: COMMAND_STATUS(IN_MEETING_SOON)', buffer);
          break;
        default:
          console.log('RECEIVED: COMMAND_STATUS(NOT RECOGNIZE STATUS)', buffer);
          break;
      }
      break;
    default:
      console.log('RECEIVED: NOT DEFINED COMMAND', buffer);
      break;
  }
});

client.on('close', function() {
  console.log('Connection closed');
});

client.on('error', function() {
  console.log('error closed');
});
