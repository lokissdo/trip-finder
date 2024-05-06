
// call API  to open https://api.weatherbit.io/v2.0/forecast/daily?city=H%E1%BB%93%20Ch%C3%AD%20Minh&country=VN&key=5913301e3e864d0f82bd84f3505ec8b7

const axios = require('axios');
const { WEATHER_API_URL, WEATHER_API_KEY } = require('../../config');

const Weather = require('../models/Weather');
class WeatherRepository {
    async getWeather(city, date,  country = 'VN') {
        // get Weather from db,  if currentDate > created_at 1 days, call API to get new weather and push to db
        const weather = await Weather
            .findOne({ city: city, date: date })
            .exec();
        
        if (weather) {
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - weather.created_at);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
                const weatherData = await this.callWeatherAPI(city, date, country);
                return weatherData;
            }
            return weather;
        }
        throw new Error('Weather not found');
    }

    async callWeatherAPI(city, date, country) {
        const url = `${WEATHER_API_URL}?city=${city}&country=${country}&key=${WEATHER_API_KEY}`;
        // I want push all 16 days to db

        const response = await axios.get(url);
        const data = response.data;

        let returnedWeather;
 

        // push to db
        const weathers = data.map(weather => {
            let weatherToInsert = {
                description: weather.weather.description,
                city: city,
                temperature: weather.temp,
                date: weather.valid_date
            };
            if (weather.valid_date == date) {
                returnedWeather = weatherToInsert
            }
            return weatherToInsert
        });

        await Weather.insertMany(weathers);
        return returnedWeather;

    }
}


module.exports = WeatherRepository;