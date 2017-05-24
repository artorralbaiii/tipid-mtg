'use strict';

let Post = require('../models/post');

module.exports = () => {
    let ctrl = {
        get: get,
        getByType: getByType,
        remove: remove,
        update: update
    };

    return ctrl;

    /* implementations */

    function remove(req, res, next) {
        Post.findByIdAndRemove(req.params.id, (err, post) => {
            if (err) { next(err); }
            res.status(200);
            res.json({ data: post });
        });
    }

    function get(req, res, next) {
        if (req.params.id) {
            Post.findById(req.params.id, (err, post) => {
                if (err) { next(err); }
                res.status(200);
                res.json({ data: post });
            });
        } else {
            Post.find({}, (err, post) => {
                if (err) { next(err); }
                res.status(200);
                res.json({ data: post });
            });
        }
    }

    function getByType(req, res, next) {
        Post.find({ postType: req.params.type }, (err, posts) => {
            if (err) { next(err); }
            res.json({ data: posts });
        });
    }

    function update(req, res, next) {
        if (req.params.id) {
            Post.findById(req.params.id, (err, post) => {
                if (err) { next(err); }
                post.condition = req.body.condition;
                post.details = req.body.details;
                post.description = req.body.description;
                post.postType = req.body.postType;
                post.price = req.body.price;

                post.save((err, post) => {
                    if (err) { next(err); }
                    res.status(200);
                    res.json({ data: post });
                });
            });
        } else {
            let newPost = new Post({
                condition: req.body.condition,
                details: req.body.details,
                description: req.body.description,
                postType: req.body.postType,
                price: req.body.price,
                user: req.decoded._id
            });

            newPost.save((err, post) => {
                if (err) { next(err); }
                res.status(200);
                res.json({ data: post });
            });
        }
    }
};