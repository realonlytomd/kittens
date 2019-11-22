var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var UserSchema = new Schema({
  // `name` of user is required and of type String
  topic: {
    type: String,
    required: true
  },
  // User's `password` is required and of type String
  answer: {
    type: String,
    required: true
  }
}, {
  // adding timestamps: created at and updated at
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var Topic = mongoose.model("Topic", UserSchema);

// Export the Article model
module.exports = Topic;
