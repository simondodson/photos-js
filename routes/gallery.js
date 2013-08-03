// Global includes
var _ = require('underscore');

// Global variables
exports.locals = {};

exports.index = function(req, res){
    res.render('create', _.extend({}, exports.locals));
};

exports.post = function(req, res){
    var mongo = require('../libs/mongo');
    var gallery = (req.body);

    mongo.gallery.add(gallery, function () {
        res.redirect('/upload/' + gallery._id);
    });
};
