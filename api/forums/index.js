'use strict';
const buildController = require('./controller'),
      Router = require('koa-router');

module.exports = (config, io) => {
    const router = new Router(),
    controller = buildController(config);
    // Get
    router.get('/list', controller.list);
    return router.routes();
};
