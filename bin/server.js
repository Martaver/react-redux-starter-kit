const config = require('../config')
const server = require('../server/main')
const debug = require('debug')('app:bin:server')
const port = config.server_port
const http = require('http');
const socketIo = require('socket.io');
const rx = require('rxjs');

let httpServer = http.createServer(server);
let io = socketIo(httpServer);

rx.Observable.interval(1000).subscribe(() => {
  io.emit('action', { type: 'TICK', payload: '*tick*'});
})

io.on('connection', function(socket){
  debug('Io - new connection established.');
})

httpServer.listen(port, function() {
  debug(`Server is now running at http://localhost:${port}.`);
});
