const { Router } = require('express');
const woeidMiddleware = require('../middleware/woeid');
const Destination = require('../models/Destination');

module.exports = Router() 
  .post('/', (req, res, next) => {
    Destination
      .create({ ...req.body })
      .then(vacationDest => res.send(vacationDest))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Destination
      .findByIdWithWeather(req.params.id)
      .then(trip => res.send(trip))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Destination
      .find()
      .then(trips => res.send(trips))
      .catch(next);
  });
