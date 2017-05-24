'use strict';

let Sell = require('../models/sell');

module.exports = () => {
    let ctrl = {
        create: create,
        get: get
    };

    return ctrl;

    /* implementations */

    function get(req, res, next) {
        if (req.params.id) {
            Sell.findOne({ _id: req.params.id }, (err, result) => {
                if (err) { next(err); }
                res.json({
                    message: 'success',
                    data: result
                });
            });
        } else {
            Sell.find({}, (err, result) => {
                if (err) { next(err); }
                res.json({
                    message: 'success',
                    data: result
                });
            });
        }
    }

    function update(req, res, next) {

        if (req.params.id) {
            Sell.findOne({ _id: req.params.id }, (err, sell) => {
                if (err) { next(err); }
                sell.condition = req.body.condition;
                sell.details = req.body.details;
                sell.description = req.body.description;
                sell.price = req.body.price;

                sell.save((err) => {
                    if (err) { next(err); }
                    res.json({ message: 'success', data: sell });
                });
            });
        } else {
            let newSell = new Sell({
                condition: req.body.condition,
                details: req.body.details,
                description: req.body.description,
                price: req.body.price,
                user: req.currentUser._id
            });

            newSell.save((err) => {
                if (err) { next(err); }
                res.status = 200;
                res.json({
                    message: 'success',
                    data: this
                });
            });
        }
    }

};