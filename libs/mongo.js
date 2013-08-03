var MongoClient = require('mongodb').MongoClient;

var collection = null;
var connect = function (callback) {
    if (collection === null) {
        MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
            if (err) throw err;

            collection = db.collection(process.env.MONGO_DB_NAME);
            callback(collection);
        });
    } else {
        callback(collection);
    }
};

var gallery = {
    findAll: function (callback) {
        connect(function (collection) {
            var albums = [];
            collection.find({}, {'sort': [['date', 'ascending']]}).each(function (err, result) {
                if (err) callback(err, result);

                if (result === null) {
                    callback(err, albums);
                }

                albums.push(result);
            });
        });
    },

    findById: function (id, callback) {
        connect(function (collection) {
            console.log("Finding id: " + id);
            collection.find({_id: id}).each(function (err, result) {
                if (err) callback(err, result);

                if (result !== null) {
                    callback(err, result);
                }
            });
        });
    },

    add: function (object, callback) {
        connect(function (collection) {
            // Create a unique id for the gallery
            var uuid = require('node-uuid');
            object._id = uuid.v4();

            console.log("Adding gallery: " + object._id);
            collection.save(object, callback);
        });
    },

    save: function (object, callback) {
        connect(function (collection) {
            console.log("Saving gallery: " + object._id);
            collection.save(object, callback);
        });
    }
};

module.exports = {
    gallery: gallery
};
