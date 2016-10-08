'use strict';

const ctrl = require('./controller'),
      Router = require('koa-router');

module.exports = (config, io) => {
    const router = new Router(),
    controller = ctrl(config, io);

    // Local routes definition
    router.get('/', controller.homePage);
    return router.routes();
};
