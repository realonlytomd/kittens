var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new MetricSchema object
var MetricSchema = new Schema({
  // `age` of kitten is required and of type String
  age: {
    type: String,
    required: true
  },
  // Kitten's `weight` is required and of type String
  weight: {
    type: String,
    required: true
  },
  // The chosen units of the kitten's weight
  unit: {
    type: String,
    required: true
  },
  // Kitten's length is required and of type String
  size: {
    type: String,
    required: true
  }
}, {
  // adding timestamps: created at and updated at
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var Metric = mongoose.model("Metric", MetricSchema);

// Export the Metric model
module.exports = Metric;