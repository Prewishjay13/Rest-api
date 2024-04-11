let mongoose = require('mongoose'),
Schema = mongoose.Schema,
mongoosePaginate = require('mongoose-paginate')

let projectModel = new Schema({
title: {
    type: String,
    required:true
},
info: {
    type: String,
    required: true
},
date: {
    type: Date
},
completed: {
    type: String,
    required : true
},
_links: {
    self: {href: {type: String}},
    collection: {href: {type: String}}
}


},{collection: "items"});

projectModel.plugin(mongoosePaginate);
module.exports = mongoose.model('projects', projectModel);