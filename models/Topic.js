var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var TopicSchema = new Schema({
  // `topic` is required and of type String
  topic: {
    type: String,
    required: true
  },
  // `topicAuthor` is required and of type String
  topicAuthor: {
    type: String,
    required: true
  },
  // the answer is not required and of type String
  answer: {
    type: String
  },
  // `answerAuthor` type of String
  answerAuthor: {
    type: String
  }
}, {
  // adding timestamps: created at and updated at, might be useful
  timestamps: true
});

// This creates our model from the above schema, using mongoose's model method
var Topic = mongoose.model("Topic", TopicSchema);

// Export the Article model
module.exports = Topic;
