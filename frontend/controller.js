'use strict';

const fs = require('fs');

module.exports = (config) => {
    return {
        homePage,
    };

    function *homePage() {
        this.body = yield readFileThunk(`${config.rootDir}/public/index.html`);
    }
};

function readFileThunk(src) {
  return new Promise((resolve, reject) => {
    fs.readFile(src, { 'encoding': 'utf8' }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
