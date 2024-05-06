const DailyScheduleRepository = require("./daily-schedule-repository");
const WeatherRepository = require("./weather-repository");
const { SEARCH_SERVICE } = require("../../config")
const { RPCRequest } = require("../../utils/rpc");


const COST_HOTEL_GAP_RATE = 0.4;
const COST_VEHICLE_GAP_RATE = 0.2;
const COST_RESTAURANT_GAP_RATE = 0.5;


class RecommendRepository {
    constructor() {
        this.dailyScheduleRepository = new DailyScheduleRepository();

        this.weatherRepository = new WeatherRepository();

    }

    async GetRecommendationsByParameters({ costOptions, startDate, endDate, province, userOptions }) {

        // Get the number of days between the start and end date
        const numOfDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        var hotel = null, dailySchedules = [];

        if (!costOptions.itinerary) {
            throw new Error("Itinerary cost option is required");
        }
        dailySchedules = await this.dailyScheduleRepository.createLandscapeScheduleByDays(province, numOfDays, costOptions.itinerary, userOptions.cheapestItinerary ? true : false);

        if (dailySchedules === -1) {
            throw new Error("Not enough suitable landscapes in the database");
        }

        const { lat, long } = await this.getMiddlePointOfItinerary(dailySchedules);

        if (costOptions.hotel) {
            const hotelRequest = {
                event: 'GET_RANDOM_HOTEL_BY_PARAMETERS',
                data: {
                    startPrice: costOptions.hotel * (1 - COST_HOTEL_GAP_RATE),
                    endPrice: costOptions.hotel * (1 + COST_HOTEL_GAP_RATE),
                    bestPrice: userOptions.cheapestHotel ? true : false,
                    checkinDate: startDate,
                    province: province,
                    location: {
                        lat: lat,
                        long: long
                    },
                    // get closest hotel to the middle point of the itinerary
                }
            };
            const hotelResponse = await RPCRequest(SEARCH_SERVICE, hotelRequest);
            hotel = hotelResponse.data;
        }


        if (costOptions.vehicle) {
            let vehicleType = userOptions.vehicleType ?? 'Xe khách';
            const vehicleRequest = {
                event: 'GET_RANDOM_VEHICLE_BY_PARAMETERS',
                data: {
                    type: vehicleType,
                    startDate: startDate,
                    endDate: endDate,
                    startPrice: costOptions.vehicle * (1 - COST_VEHICLE_GAP_RATE),
                    endPrice: costOptions.vehicle * (1 + COST_VEHICLE_GAP_RATE),
                    bestPrice: userOptions.cheapestVehicle ? true : false,
                }
            };
            const vehicleResponse = await RPCRequest(SEARCH_SERVICE, vehicleRequest);
            vehicles = vehicleResponse.data;
        }



        if (costOptions.restaurant) {
            let maxPriceQuery = costOptions.restaurant * (1 + COST_RESTAURANT_GAP_RATE) / (2 * numOfDays); // for midday and afternoon
            for (let i = 0; i < dailySchedules.length; i++) {
                const schedule = dailySchedules[i];
                const restaurantRequest = {
                    event: 'GET_RANDOM_RESTAURANT_BY_PARAMETERS',
                    data: {
                        startPrice: maxPriceQuery * (1 - COST_RESTAURANT_GAP_RATE),
                        endPrice: maxPriceQuery * (1 + COST_RESTAURANT_GAP_RATE),
                        bestPrice: userOptions.cheapestRestaurant ? true : false,
                        province: province,
                        location: {
                            lat: schedule.morning.lat,
                            long: schedule.morning.long
                        },
                        // closest restaurant to the morning landscape
                    }
                };
                const midDayRestaurantResponse = await RPCRequest(SEARCH_SERVICE, restaurantRequest);
                schedule.midDayRestaurant = midDayRestaurantResponse.data;
                restaurantRequest.data.location = {
                    lat: schedule.afternoon.lat,
                    long: schedule.afternoon.long
                };
                const afternoonRestaurantResponse = await RPCRequest(SEARCH_SERVICE, restaurantRequest);
                schedule.afternoonRestaurant = afternoonRestaurantResponse.data;

                dailySchedules[i] = schedule;

            }

        }

        let weatherData = await this.weatherRepository.getWeatherByProvince(province, startDate);

        return {
            weather: weatherData,
            hotel,
            vehicles,
            dailySchedules
        };

    }

    async getMiddlePointOfItinerary(dailySchedules) {

        let lat = 0;
        let long = 0;
        dailySchedules.forEach(schedule => {
            if (schedule.evening) {
                lat += (schedule.morning.lat + schedule.afternoon.lat + schedule.evening.lat) / 3
                long += (schedule.morning.long + schedule.afternoon.long + schedule.evening.long) / 3
            }
            else {
                lat += (schedule.morning.lat + schedule.afternoon.lat) / 2
                long += (schedule.morning.long + schedule.afternoon.long) / 2
            }


        });
        return {
            lat: lat / dailySchedules.length,
            long: long / dailySchedules.length
        };
    }


}

module.exports = RecommendRepository;