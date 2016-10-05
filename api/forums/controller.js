'use strict';
//const _ = require('lodash');

const fakeForums = {
    'Discussions generales': [],
    'Le coin des associations': [],
};

const forums = fakeForums;

module.exports = (config, io) => {
    return {
        list,
    };
    function *list() {
        console.dir(this.query, { depth: 20 });
/*        if (!country || country.length <= 0) {
            this.status = 400;
            this.body = 'No country specified';
            return;
        }*/
        this.body = Object.keys(forums);
    }
};
