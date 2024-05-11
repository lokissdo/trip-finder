const Hotel = require('../models/Hotel'); // Import Hotel model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');
const mongoose = require('mongoose');
const HOTEL_INDEX_NAME = 'hotels'
class HotelRepository {
    constructor() {
        this.esClient = new elasticsearch.Client({
            host: ELASTICSEARCH_URL // Replace with your Elasticsearch connection details
        });
    }

    async createIndexMapping() {
        const indexExists = await this.esClient.indices.exists({ index: HOTEL_INDEX_NAME });
        if (!indexExists) {
            await this.esClient.indices.create({
                index: HOTEL_INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            province: { type: 'keyword' },
                            location: { type: 'geo_point' }, // Geolocation field
                            rating: { type: 'float' },
                            checkin: { type: 'keyword' },
                            price: { type: 'float' },
                            platform: { type: 'text' },
                        }
                    }
                }
            });
        }
    }

    // Index data from MongoDB into Elasticsearch
    async indexWholeData() {

        await this.createIndexMapping();
        const hotels = await Hotel.find();

        // Initialize an array to hold bulk operations
        const body = [];

        // Build the bulk request
        hotels.forEach(hotel => {
            body.push({
                index: {
                    _index: HOTEL_INDEX_NAME,
                    _id: hotel.id // Optionally include the document ID
                }
            });
            body.push({
                name: hotel.name,
                province: hotel.province,
                location: {
                    lat: hotel.latitude,
                    lon: hotel.longitude
                },
                rating: hotel.rating,
                // parse moongoose date to yyyy-mm-dd
                checkin: (new Date(hotel.checkin)).toISOString().split('T')[0],
                price: hotel.price,
                platform: hotel.platform,
            });
        });

        // Perform the bulk indexing
        const response = await this.esClient.bulk({ refresh: true, body });

        console.log('Indexed hotels:', response);
        if (response.errors) {
            const erroredDocuments = []
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        // Original Hotel object causing the error
                        hotel: hotels[i],
                        // Error causing the failure
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }


    async getHotelByName({ name, start, end, checkinDate, checkoutDate, platform, province, location, sort, page = 1, pageSize = 20 }) {
        const mustQueries = [];
        //console.log(province)
        // Fuzzy search for nam
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


        if (checkinDate) {
            let shortCheckinDate = (new Date(checkinDate)).toISOString().split('T')[0];  
            mustQueries.push({
                term: {
                    checkin: shortCheckinDate // Exact checkinDate
                }
            });
        }

        if (province) {
            mustQueries.push({
                match_phrase: {
                    province: province
                }
            });
        }

        // Range filter for price
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
                    },
                }
            });
        }
        const query = {
            bool: {
                must: mustQueries
            }
        };

        let sortOption;
        // Sorting logic
        if (sort) {
            sortOption = sort.split(',').map(field => {
                const [key, order] = field.split(':');
                if (key == 'location') {
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

            console.log('\n - Search Serivce - Hotel-  Sort:', sortOption)


        }

        // Pagination
        const from = (page - 1) * pageSize;

        try {
            // console.log('\n - Search Serivce - Hotel-  Query:', query.bool.must)
            const response = await this.esClient.search({
                index: HOTEL_INDEX_NAME,
                body: {
                    query,
                    from,
                    size: pageSize,
                    ...(sort ? { sort: sortOption } : {})

                },
            });

            console.log('\nSearch Serivce - Hotel-  Query - Response:', response);
            const hits = response.hits.hits;
            console.log('\n Search Serivce - Hotel-  Query - Hits:', hits[1]);

            const hotelIds = hits.map(hit => mongoose.Types.ObjectId(hit._id));
            let sortMongo = {}

            if (sort) {
                sortMongo = sort.split(',').reduce((acc, field) => {
                    const [key, order] = field.split(':');
                    acc[key] = order === 'asc' ? 1 : -1;
                    return acc;
                }, {});
            }
            // Fetching hotel documents from MongoDB using the retrieved IDs
            const hotelsFromMongo = await Hotel.find({
                '_id': { $in: hotelIds }
            }).sort(sortMongo)



            // Returning hotels fetched from MongoDB
            return hotelsFromMongo.map(hotel => ({
                ...hotel.toObject(), // Converting mongoose document to plain JavaScript object
                id: hotel._id // Adding the ID field
            }));
        } catch (error) {
            console.error('Error searching hotels:', error);
            return [];
        }
    }

}

module.exports = HotelRepository;