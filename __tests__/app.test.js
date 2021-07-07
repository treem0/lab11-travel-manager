require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Destination = require('../lib/models/Destination');
const ItineraryItem = require('../lib/models/Itinerary');

jest.mock('../lib/services/weather.js', () => ({
  getWOEID() {
    return Promise.resolve('12345');
  },
  getWeather() {
    return Promise.resolve({
      min_temp: 5
    });
  }
}));

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let trip;
  let itineraryItem;
  beforeEach(async() => {
    trip = await Destination.create({
      name: 'Durban Spring 2020'
    });

    itineraryItem = await ItineraryItem.create({
      trip: trip._id,
      startDate: new Date('2020-03-21'),
      endDate: new Date('2020-03-22'),
      woeid: '2487956',
      name: 'Visit Bakery'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a trip', () =>{ 
    return request(app)
      .post('/api/v1/vacations')
      .send({ name: 'Cool Durban Trip' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Cool Durban Trip',
          __v: 0
        });
      });
  });

  it('gets a trip by id', () => {
    return request(app)
      .get(`/api/v1/vacations/${trip._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: trip._id,
          name: 'Durban Spring 2020',
          itinerary: [{
            _id: itineraryItem._id,
            trip: trip._id,
            startDate: itineraryItem.startDate.toISOString(),
            endDate: itineraryItem.endDate.toISOString(),
            temp: 5,
            name: 'Visit Bakery',
            woeid: '2487956',
            __v: 0
          }],
          __v: 0
        });
      });
  });
  it('gets all trips', () => {
    return request(app)
      .get('/api/v1/vacations')
      .then(res => {
        expect(res.body).toEqual([JSON.parse(JSON.stringify(trip))]);
      });
  });
});
