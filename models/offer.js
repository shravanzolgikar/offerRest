var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiSchema = new Schema({
    title: {type: String,required: true},
    ids: {type: String,required: true},
    division_lat: {type: String,required: true},
    division_lng: {type: String,required: true},
    ImageUrl: {type: String,required: true},
    createdDate: {type: Date, required: true, default: Date.now},
    modifiedDate: {type: Date, required: false}
});

module.exports = mongoose.model('api', apiSchema);