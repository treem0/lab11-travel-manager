const mongoose = require('mongoose');
const { getWOEID, getWeather } = require('../services/weather');

const weatherSchema = new mongoose.Schema({
  weather_state_name: {
    type: String,
    required: true
  },
  wind_direction_compass: {
    type: String,
    required: true
  },
  applicable_date: {
    type: String,
    required: true
  }, 
  min_temp: {
    type: Number,
    required: true
  },
  max_temp: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  }
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2013,
    max: 2050
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
//   weather: [weatherSchema]
}, {
  id: false,
  toJSON: { virtuals: true }
});

schema.virtual('itinerary', {
  ref: 'Itinerary',
  localField: '_id',
  foreignField: 'destination',
});

schema.virtual('weather')
  .get(function() {
    getWOEID(this.cityName)
      .then(async woeid => {
        const weather = await getWeather(woeid, this.year, this.month, this.day);
        return weather;}
      );
  });

module.exports = mongoose.model('Destination', schema);
