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
  // `kitten` is an object that stores individual cats.
  // The ref property links the ObjectId to the Kitten model
  // So it's possible to populate a User with an associated Kitten, should be more than one.
  kitten: {
    type: Schema.Types.ObjectId,
    ref: "Kitten"
  }
}, {
  // adding timestamps: created at and updated at
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("User", UserSchema);

// Export the Article model
module.exports = User;
