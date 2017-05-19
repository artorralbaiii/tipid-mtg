'use strict';

module.exports = () => {
    let service = {
        handle: handle
    };

    return service;

    // Implementations

    function handle(err, req, res, next) {
        var status = err.statusCode || 500;
        if (err.message) {
            res.send(status, err.message);
        } else {
            res.send(status, err);
        }
        next();
    }
};