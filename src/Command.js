const Room = require('./Room');
const StatusRoom = require('./StatusRoom');

const REGISTER = 1;
const RESERVE  = 2;
const STATUS   = 3;

const dataHandler = socket => buffer => {
  const command = buffer[0];
  const data = buffer[1];

  switch(command) {
    case REGISTER:
      console.log(`RECEIVED: COMMAND_REGISTER(${data})`, buffer);
      register(socket)(data);
      break;
    case RESERVE:
      console.log(`RECEIVED: COMMAND_RESERVE(${data})`, buffer);
      reserve(socket)(data);
      break;
  }
}

const register = socket => device => {
  socket.device = device;
  return updateStatus(socket);
};

const reserve = socket => param =>
  Room.get(socket.device)
    .then(Room.reserve)
    .then(StatusRoom.get)
    .then(sendStatus(socket));

const sendStatus = socket => status => {
  const sendBuffer = Buffer.from([STATUS, status], 2);
  console.log(`SEND:     COMMAND_STATUS(${StatusRoom.getName(status)})`, sendBuffer);
  socket.write(sendBuffer);
};

const updateStatus = socket =>
  Room.get(socket.device)
    .then(StatusRoom.get)
    .then(sendStatus(socket));

const sendStatusInterval = clients => interval =>
  setInterval(function() {
    clients.forEach(socket => {
      Room.get(socket.device)
        .then(StatusRoom.get)
        .then(sendStatus(socket))
    });
  }, interval);

module.exports = {
  REGISTER,
  RESERVE,
  STATUS,
  dataHandler,
  sendStatusInterval,
};
