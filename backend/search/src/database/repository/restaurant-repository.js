const Restaurant = require('../models/Restaurant'); // Import Restaurant model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');
const mongoose = require('mongoose');
const RESTAURANT_INDEX_NAME = 'restaurants';

class RestaurantRepository {
    constructor() {
        this.esClient = new elasticsearch.Client({
            host: ELASTICSEARCH_URL // Replace with your Elasticsearch connection details
        });
    }

    async createIndexMapping() {
        const indexExists = await this.esClient.indices.exists({ index: RESTAURANT_INDEX_NAME });
        if (!indexExists) {
            await this.esClient.indices.create({
                index: RESTAURANT_INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            province: { type: 'text' },
                            location: { type: 'geo_point' },
                            rating: { type: 'float' },
                            price: { type: 'float' },
                            platform: { type: 'text' },
                        }
                    }
                }
            });
        }
    }

    async indexWholeData() {
        await this.createIndexMapping();
        const restaurants = await Restaurant.find();
        console.log('Indexing restaurants:', restaurants.length, 'documents')
        const body = [];
        restaurants.forEach(restaurant => {
            body.push({
                index: {
                    _index: RESTAURANT_INDEX_NAME,
                    _id: restaurant.id
                }
            });
            body.push({
                name: restaurant.name,
                province: restaurant.province,
                location: {
                    lat: restaurant.latitude,
                    lon: restaurant.longitude
                },
                rating: restaurant.rating,
                price: restaurant.price,
                platform: restaurant.platform,
            });
        });

        const response = await this.esClient.bulk({ refresh: true, body });
        console.log('Indexed restaurants:', response);
        if (response.errors) {
            const erroredDocuments = [];
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        restaurant: restaurants[i],
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }

    async searchRestaurants({ name,province,platform, start,end,location, sort, page = 1, pageSize = 20 }) {
        const mustQueries = [];
    

        if (name) {
            mustQueries.push({
                match: {
                    name: {
                        query: name,
                        fuzziness: "AUTO"
                    }
                }
            });
        }

        if (province) {
            mustQueries.push({
                match: {
                    province: {
                        query: province,
                        fuzziness: "AUTO"
                    }
                }
            });
        }
        if (platform) {
            mustQueries.push({
                match: {
                    platform: {
                        query: platform,
                        fuzziness: "AUTO"
                    }
                }
            });
        }

        if (start && end) {
            mustQueries.push({
                range: {
                    price: {
                        gte: start,
                        lte: end
                    }
                }
            });
        }

        // Geo-distance filter for location
        if (location) {
            mustQueries.push({
                geo_distance: {
                    distance: location.distanceSearch,
                    "location": { // Ensure this matches the field name in the mapping
                        lat: location.latitude,
                        lon: location.longitude
                    }
                }
            });
        }
        const queryBody = {
            bool: {
                must: mustQueries
            }
        };
        let sortOption ;
        // Sorting logic
        if (sort) {
            sortOption = sort.split(',').map(field => {
                const [key, order] = field.split(':');

                if (key == 'location' && location) {
                    return {
                        _geo_distance:
                        {
                            location:
                            {
                                lat: location.latitude, lon: location.longitude

                            }, 
                            order: order, unit: 'km'
                        }
                    }
                }
                return { [key]: { order } };
              });

        }

        const from = (page - 1) * pageSize;
        try {
            const response = await this.esClient.search({
                index: RESTAURANT_INDEX_NAME,
                body: {
                    query: queryBody,
                    from,
                    size: pageSize,
                    ...(sort ? { sort:sortOption } : {})
                }
            });
            const hits = response.hits.hits;

            const restaurantIds = hits.map(hit => mongoose.Types.ObjectId(hit._id));

            // let sortMongo = {}

            // if (sort) {
            //     sortMongo = sort.split(',').reduce((acc, field) => {
            //         const [key, order] = field.split(':');
            //         acc[key] = order === 'asc' ? 1 : -1;
            //         return acc;
            //     }, {});
            // }
            // Fetching hotel documents from MongoDB using the retrieved IDs
            const restaurantsFromMongo = await Restaurant.find({
                '_id': { $in: restaurantIds}
            })
            // .sort(sortMongo)

            // Returning restaurants fetched from MongoDB
            // return restaurantsFromMongo.map(restaurant => ({
            //     ...restaurant.toObject(), // Converting mongoose document to plain JavaScript object
            //     id: restaurant._id // Adding the ID field
            // }));
            
            return restaurantIds.map(id => restaurantsFromMongo.find(restaurant => restaurant._id.toString() == id));
        } catch (error) {
            console.error('Error searching restaurants:', error);
            return [];
        }
    }
}

module.exports = RestaurantRepository;
