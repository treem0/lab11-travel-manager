const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  thingToDo: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  }
});

module.exports = mongoose.model('Itinerary', schema);
