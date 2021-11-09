//Product constructor
const mongoose= require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema
//schema of clothes product details
({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Product',schema);