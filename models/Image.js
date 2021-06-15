// Step 3 - this is the code for ./models.js
 
var mongoose = require('mongoose');
 
var ImageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
}, {
    // adding timestamps: created at and updated at
    timestamps: true
});
 
//Image is a model which has a schema imageSchema
 
module.exports = new mongoose.model("Image", ImageSchema);