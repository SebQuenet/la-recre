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
const staticCache = require('koa-static-cache');

const config = require('./config');
const path = require('path');


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


// Static cache management
const files = {};
app.use(staticCache('public/js', {}, files));
staticCache('public/css', {}, files);
staticCache('public/fonts', {}, files);
staticCache('public/images', {}, files);

const fs = require('fs');

const readFileThunk = function(src) {
  return new Promise(function (resolve, reject) {
    fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
      if(err) return reject(err);
      resolve(data);
    });
  });
}

const rootRouter = Router();
rootRouter.get('/', function *(){
  this.body = yield readFileThunk(__dirname + '/public/index.html');
});


app.use(staticCache(path.join(__dirname, 'public'), {
    maxAge: 365 * 24 * 60 * 60,
}));

// Create server and Socket.IO
const httpServer = http.Server(app.callback()),
      io = socketIO(httpServer);
// Define routes
const router = new Router();

router.use('/api/forums', require('./api/forums/')(config, io));
router.get('/', function *(next){
    this.body = yield readFileThunk(__dirname + '/public/index.html');
});

app.use(router.routes());
// Start server
const server = httpServer.listen(config.port, (err) => {
    if (err) {
        return winston.error('%s server error: ', app.name, err);
    }
    winston.info('%s listening at http://localhost:%d', app.name, config.port, config.env);
});
module.exports = server;


