const Hotel = require('../models/Hotel'); // Import Hotel model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');

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
                            province: {type: 'keyword' },
                            location: { type: 'geo_point' }, // Geolocation field
                            rating: { type: 'float' },
                            checkin: { type: 'text' },
                            checkout: { type: 'text' },
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
                checkin: hotel.checkin,
                checkout: hotel.checkout,
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


    async getHotelByName({ name, start, end, province, location, sort, page = 1, pageSize = 20 }) {
        const mustQueries = [];
        console.log(province)
        // Fuzzy search for name
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
                    }
                }
            });
        }
        console.log(mustQueries.toString())
        const query = {
            bool: {
                must: mustQueries
            }
        };

        // Sorting logic
        if (sort) {
            query.sort = sort.split(',').reduce((acc, field) => {
                const [key, order] = field.split(':');
                acc[key] = { order: order };
                return acc;
            }, {});
        }

        // Pagination
        const from = (page - 1) * pageSize;

         console.log(query)
        try {
            const response = await this.esClient.search({
                index: HOTEL_INDEX_NAME,
                body: {
                    query,
                    from,
                    size: pageSize,
                    ...(sort ? { sort: query.sort } : {})
                }
            });
            const hits = response.hits.hits;
            return hits.map(hit => ({ ...hit._source, id: hit._id }));
        } catch (error) {
            console.error('Error searching hotels:', error);
            return [];
        }
    }

}

module.exports = HotelRepository;