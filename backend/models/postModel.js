const mongoose = require('mongoose')


//this is how u make a schema/table
const postSchema = mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Insert text value']},
    text:{
        type: String,
        required: [true, 'insert text']
    },
    adress:{
        type: String,
        required: [true, 'Insert adress']
    },
    zipcode:{
        type: String,
        required: [true, 'Insert zipcode']
    },
    cost:{
        type: String,
        required: [true, 'Insert zipcode']
    },
},
{
    timestamps: true, 
})

//exporting a model looks a bit different
//the model needs to be imported in the controller
module.exports = mongoose.model('Post', postSchema)
