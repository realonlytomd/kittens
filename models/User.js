var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var UserSchema = new Schema({
  // `name` of user is required and of type String
  name: {
    type: String,
    required: true
  },
  // User's `password` is required and of type String
  password: {
    type: String,
    required: true
  },
  // `metric` is an object that stores a Metric id.
  // The ref property links the ObjectId to the Metric model
  // So now it's possible to populate the Article with an associated Note
  metric: {
    type: Schema.Types.ObjectId,
    ref: "Metric"
  }
}, {
  // adding timestamps: created at and updated at
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the Article model
module.exports = User;
