// this is not complete yet.
// need to figure out how to get multiple kitten for one user

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new KittenSchema object
var KittenSchema = new Schema({
  // `name` is of type String, the name of the kitten, expands to however many
  // kittens each user has.
  name: String,
  // `weight` and 'length' is of type Number, for now, just an example
  // of what is to come. Wil need to add and age Model too
  // focus currently, is to figure out getting multiple kittens for each user
  weight: String,
  length: String
});

// This creates our model from the above schema, using mongoose's model method
var Kitten = mongoose.model("Kitten", KittenSchema);

// Export the Note model
module.exports = Kitten;