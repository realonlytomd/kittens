// this is not complete yet.
// need to figure out how to get multiple kitten for one user

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new KittenSchema object
var KittenSchema = new Schema({
  // `name` is of type String, the name of the kitten, expands to however many
  // kittens each user has.
  name: {
    type: String,
    required: true
  },
  // `metric` is an object that that will reference the metrics of the kittens.
  // The ref property links the ObjectId to the Metric model
  // So it's possible to populate a Kitten with multiple metrics, use an array of ObjectIds
  metric: [{
    type: Schema.Types.ObjectId,
    ref: "Metric"
  }]
}, {
  // adding timestamps: created at and updated at
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var Kitten = mongoose.model("Kitten", KittenSchema);

// Export the Note model
module.exports = Kitten;