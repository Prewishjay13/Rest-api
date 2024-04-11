const mongoose = require('mongoose');

// Define the schema for the post
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Insert text value']
    },
    text: {
        type: String,
        required: [true, 'Insert text']
    },
    address: {
        type: String,
        required: [true, 'Insert address']
    },
    _links:{
        self:{
            href:{
                type: String
            }
        }, collection: {href: {type: String}}
    }, 
});

// Set virtuals for toObject and toJSON
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

// Add virtual properties to the model instance.
// postSchema.virtual('_links').get(function () {
//     return {
//         "self": {
//             "href": 'http://145.24.222.132:8000/posts' + this._id,
//         },
//         "collection": {
//             "href": 'http://145.24.222.132:8000/posts'
//         }
//     };
// });

// Export the model
module.exports = mongoose.model('Post', postSchema);
