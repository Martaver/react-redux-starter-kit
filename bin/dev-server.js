const project = require('../config/project.config')
const server = require('../server/main')
const debug = require('debug')('app:bin:dev-server')
const socketIo = require('socket.io')
const rx = require('rxjs')

const httpServer = server.listen(project.server_port)
let io = socketIo(httpServer)

rx.Observable.interval(1000).subscribe(() => {
  io.emit('action', { type: 'TICK', payload: '*tick*' })
})

io.on('connection', function (socket) {
  debug('Io - new connection established.')
})

debug(`Server is now running at http://localhost:${project.server_port}.`)
