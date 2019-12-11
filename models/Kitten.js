var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new KittenSchema object
var KittenSchema = new Schema({
  // `name` is of type String, the name of the kitten, expands to however many
  // kittens each user has.
  name: String,
  // `metricOne` is of type String, for now, needs to be renamed the actual metric:
  // i.e., age, etc. A list of milestones. There will be however many 
  metricOne: String
});

// This creates our model from the above schema, using mongoose's model method
var Kitten = mongoose.model("Kitten", KittenSchema);

// Export the Note model
module.exports = Kitten;
