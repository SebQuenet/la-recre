'use strict';

const bodyParser = require('koa-bodyparser'),
      compress = require('koa-compress'),
      cors = require('kcors'),
      errorHandler = require('koa-error'),
      http = require('http'),
      Koa = require('koa'),
      Router = require('koa-router'),
      socketIO = require('socket.io'),
      winston = require('winston');
const config = require('./config');
// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });
winston.level = 'debug';
// Configure KOA framework
const app = new Koa();
app.name = '[CCA] Backend Data';
app.use(errorHandler());
app.use(cors());
app.use(compress());
app.use(bodyParser());
// Create server and Socket.IO
const httpServer = http.Server(app.callback()),
      io = socketIO(httpServer);
// Define routes
const router = new Router({prefix: '/api'});
// Authenticate
router.use('/api', require('./forums/')(io));
app.use(router.routes());
// Start server
const server = httpServer.listen(config.port, (err) => {
    if (err) {
        return winston.error('%s server error: ', app.name, err);
    }
    winston.info('%s server listening at http://localhost:%d in %s mode', app.name, config.port, config.env);
});
module.exports = server;


