/* global __dirname */

'use strict';

// Externals
const bodyParser = require('koa-bodyparser'),
      compress = require('koa-compress'),
      cors = require('kcors'),
      errorHandler = require('koa-error'),
      http = require('http'),
      Koa = require('koa'),
      KoaRouter = require('koa-router'),
      socketIO = require('socket.io'),
      winston = require('winston'),
      staticCache = require('koa-static-cache'),
      path = require('path');


// Config
const config = require('./config');
config.rootDir = __dirname;

// Logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true });
winston.level = 'debug';

// Configure KOA framework
const app = new Koa();
app.name = 'La Recre web server';
app.use(errorHandler());
app.use(cors());
app.use(compress());
app.use(bodyParser());


// Static cache management, a voir avec Varnish par la suite
const files = {};
app.use(staticCache('public/js', {}, files));
staticCache('public/css', {}, files);
staticCache('public/fonts', {}, files);
staticCache('public/images', {}, files);

app.use(staticCache(path.join(`${__dirname}/public`), {
    maxAge: 365 * 24 * 60 * 60,
}));

// Create server and Socket.IO
const httpServer = new http.Server(app.callback()),
      io = socketIO(httpServer);

// Define routes
const router = new KoaRouter();

// Frontend
router.get('/', require('./frontend/')(config, io));

// API
router.use('/api/forums', require('./api/forums/')(config, io));

app.use(router.routes());


// Start server
const server = httpServer.listen(config.port, (err) => {
    if (err) {
        return winston.error('%s server error: ', app.name, err);
    }
    winston.info('%s listening at http://localhost:%d', app.name, config.port, config.env);
});

module.exports = server;
