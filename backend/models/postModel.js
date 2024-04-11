const mongoose = require('mongoose');

let postModel = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    flavor: {
        type: String,
        required:true
    },
    color: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required:true
    },
    _links: {
        items: [{
            _links: {
                self: {
                    type: String
                },
                collection: {
                    type: String
                }
            }
        }],
        collection: {
            type: String
        }
    }
}, { collection: "items" });

module.exports = mongoose.model('Post', postModel);
