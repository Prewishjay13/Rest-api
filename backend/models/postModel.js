const mongoose = require('mongoose');

let postModel = mongoose.Schema({
    name:{
        type: String
    },
    flavor:{
        type: String
    },
    color:{
        type: String
    },
    price:{
        type: String
    },
    _links:{
        self:{
            href:{
                type: String
            }
        },
        collection: {
            href: {
                type: String
            }
        }
    }
});

module.exports = mongoose.model('Post', postModel);