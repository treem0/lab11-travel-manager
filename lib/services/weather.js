const superagent = require('superagent');


const getWOEID = (cityName) => {
  return superagent
    .get(`https://www.metaweather.com/api/location/search/?query=${cityName}`)
    .then(res => {
      const [{ woeid }] = res.body;
      return woeid;
    });
};

const getWeather = (woeid, year, month, day) => {
  return superagent
    .get(`https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}`)
    .then(res => {
      const [{ weather_state_name, wind_direction_compass, applicable_date, min_temp, max_temp, humidity }] = res.body;
      return [{ weather_state_name, wind_direction_compass, applicable_date, min_temp, max_temp, humidity }];
    });
};

module.exports = {
  getWOEID,
  getWeather
};
