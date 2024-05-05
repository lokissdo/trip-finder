const Hotel = require('../models/Hotel'); // Import Hotel model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');

class HotelRepository {
    constructor() {
        this.esClient = new elasticsearch.Client({
            host: ELASTICSEARCH_URL // Replace with your Elasticsearch connection details
        });
        console.log('Elasticsearch is running:', this.esClient);
    }

    async createIndexMapping() {
        await this.esClient.indices.create({
            index: 'hotels',
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        province: { type: 'text' },
                        location: { type: 'geo_point' }, // Geolocation field
                        page_url: { type: 'text' },
                        rating: { type: 'float' },
                        checkin: { type: 'text' },
                        checkout: { type: 'text' },
                        standard: { type: 'text' },
                        price: { type: 'float' },
                        platform: { type: 'text' },
                        image_url: { type: 'text' },
                        description: { type: 'text' }
                    }
                }
            }
        });
    }

    // Index data from MongoDB into Elasticsearch
    async indexWholeData() {

        //await this.createIndexMapping();
        const hotels = await Hotel.find();

        // Initialize an array to hold bulk operations
        const body = [];

        // Build the bulk request
        hotels.forEach(hotel => {
            body.push({
                index: {
                    _index: 'hotels',
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
                page_url: hotel.page_url,
                rating: hotel.rating,
                checkin: hotel.checkin,
                checkout: hotel.checkout,
                standard: hotel.standard,
                price: hotel.price,
                platform: hotel.platform,
                image_url: hotel.image_url,
                description: hotel.description
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

    //'rating:desc,price:asc'
    async getHotelByName({ name, start, end, location, sort, page = 1, pageSize = 20 }) {

        // const pingResponse = await this.esClient.ping({
        //     requestTimeout: 1000,
        //   });
        //   console.log('Elasticsearch is running:', pingResponse);
        // return [];
        await this.createIndexMapping(); // Ensure index is created (optional, can be called once)

        const mustQueries = [];

        // Filter by name (fuzzy matching for flexibility)
        mustQueries.push({
            fuzzy: {
                name: {
                    value: name,
                    fuzziness: 2 // Adjust fuzziness as needed
                }
            }
        });

        // Filter by date range (if provided)
        if (start && end) {
            mustQueries.push({
                range: {
                    price: {
                        gte: start, // Greater than or equal to start price
                        lte: end // Less than or equal to end price
                    }
                }
            });
        }

        // Filter by location (if provided)
        if (location) {
            mustQueries.push({
                geo_distance: {
                    distance: location.distanceSearch, // Adjust distance radius as needed
                    location: {
                        lat: location.latitude,
                        lon: location.longitude
                    }
                }
            });
        }

        const query = {
            query: {
                bool: { must: mustQueries }
            }
        };

        // Add sorting (if provided)
        if (sort) {
            const sortObject = {};
            sort.split(',').forEach(field => {
                const parts = field.split(':');
                sortObject[parts[0]] = parts[1] === 'asc' ? 'asc' : 'desc';
            });
            query.sort = sortObject;
        }

        // Add pagination (if provided)
        if (page && pageSize) {
            const from = (page - 1) * pageSize;
            query.from = from;
            query.size = pageSize;
        }

        try {
            const response = await this.esClient.search({
                index: 'hotels',
                body: query
            });
            const hits = response.hits.hits;
            return hits.map(hit => ({ ...hit._source, id: hit._id })); // Map results to desired format
        } catch (error) {
            console.error('Error searching hotels:', error);
            return []; // Return empty array on error
        }
    }
}

module.exports = HotelRepository;