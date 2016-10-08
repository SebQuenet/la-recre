'use strict';
//const _ = require('lodash');

const fakeForums = {
    'Discussions generales': [],
    'Le coin des associations': [],
};

const forums = fakeForums;

module.exports = () => {
    return {
        list,
    };
    function *list() {
        this.body = Object.keys(forums);
    }
};
