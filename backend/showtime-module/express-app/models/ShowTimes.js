const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showTimeSchema = new Schema({
    movieName: String,
    date: String,
    theaterName: String,
    showTime: String,
    bookingLink: String
})

module.exports = mongoose.model('ShowTimes', showTimeSchema)