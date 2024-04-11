const mongoose = require('mongoose');
mongoosePaginate = require('mongoose-paginate')

let postModel = mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Insert text value']
    },
    flavor: {
        type: String,
        required:[true, 'Insert text value']
    },
    color: {
        type: String,
        required:[true, 'Insert text value']
    },
    price: {
        type: String,
        required:[true, 'Insert text value']
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

postModel.plugin(mongoosePaginate);
module.exports = mongoose.model('Post', postModel);
