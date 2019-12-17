require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Destination = require('../lib/models/Destination');

let vacation;

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  beforeEach(() =>{
    vacation = 
    Destination
      .create({
        name: 'Cool Durban Trip',
        cityName: 'Durban',
        year: 2019,
        month: 12,
        day: 16
      });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a trip', () =>{ 
    return request(app)
      .post('/api/v1/vacations')
      .send({ 
        name: 'Cool Durban Trip',
        cityName: 'Durban',
        year: 2019,
        month: 12,
        day: 16
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Cool Durban Trip',
          cityName: 'Durban',
          year: 2019,
          month: 12,
          day: 16,
          weather: [{
            '_id': expect.any(String),
            'applicable_date': '2019-12-16',
            'humidity': 63,
            'max_temp': 5.23,
            'min_temp': -3.5,
            'weather_state_name': 'Light Cloud',
            'wind_direction_compass': 'SSW'
          }],
          __v: 0
        });
      });
  });
});
