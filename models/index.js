// Exporting an object containing all of the models
//  this will change in kittens
// Topics is actually seperate, Kittens is a "note" of User.
//
module.exports = {
  User: require("./User"),
  Kitten: require("./Kitten"),
  Metric: require("./Metric"),
  Topic: require("./Topic")
};
