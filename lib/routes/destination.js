const { Router } = require('express');
const { getWOEID, getWeather } = require('../services/weather');
const Destination = require('../models/Destination');

module.exports = Router() 
  .post('/', async(req, res, next) => {
    const { cityName, year, month, day } = req.body;
    const woeId = await getWOEID(cityName);
    const weather = await getWeather(woeId, year, month, day);
    Destination
      .create({
        name: req.body.name,
        cityName: cityName,
        year: year,
        month: month,
        day: day,
        weather: weather
      })
      .then(vacationDest => res.send(vacationDest))
      .catch(next);
  })
  .get('/', async(req, res, next) => {
    Destination
      .find()
      .then(vacations => {
        return vacations.map(vacation => vacation.cityName);
      })
      .then(cityNames => {
        const woeids = cityNames.map(async cityName => await getWOEID(cityName));
        return woeids;
      })
      .then(woeids => {
        const weather = woeids.map(async woeid => await getWeather(woeid));
        return weather;
      })
      .catch(next);
  });
