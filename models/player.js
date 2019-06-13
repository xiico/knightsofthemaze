// load the things we need
var mongoose = require('mongoose');

// define the schema for our player model
var playerSchema = mongoose.Schema(
{
  "tag": String,
  "name": String,
  "items": [Number],
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Player', playerSchema);