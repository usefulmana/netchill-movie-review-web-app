const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
    city: String,
    theaters: [{type:String}]
})

module.exports = mongoose.model('Cities', CitiesSchema)