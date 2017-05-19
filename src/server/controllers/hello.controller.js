'use strict';

module.exports = () => {
    var ctrl = {
        hello: hello
    };

    return ctrl;

    // Implementations

    function hello(req, res, next) {
        res.json({ msg: 'MEAN Stack Application' });
    }

};