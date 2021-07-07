const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
}, {
  id: false,
  toJSON: { virtuals: true }
});

schema.virtual('itinerary', {
  ref: 'Itinerary',
  localField: '_id',
  foreignField: 'destination',
});

schema.statics.findByIdWithWeather = async function(id) {
  const trip = await this
    .findById(id)
    .populate('itinerary');

  const itinerary = await Promise.all(trip.itinerary.map(item => item.getWeather()));

  return {
    ...trip.toJSON(),
    itinerary
  };
};

module.exports = mongoose.model('Destination', schema);
