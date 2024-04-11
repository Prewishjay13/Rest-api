const mongoose = require('mongoose');

let postModel = mongoose.Schema({
    name: {
        type: String
    },
    flavor: {
        type: String
    },
    color: {
        type: String
    },
    price: {
        type: String
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
