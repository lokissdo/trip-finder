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
    async indexDataWithinDateRange(startDate, endDate) {
        await this.createIndexMapping();
        const hotels = await Hotel.find({
            updatedAt: { $gte: startDate, $lte: endDate }
        });

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


    async removeIndexBeforeDate(beforeDate) {
        const hotels = await Hotel.find({
            updatedAt: { $lt: beforeDate }
        });

        console.log('Found hotels to remove:', hotels.length, 'documents');

        const body = [];
        hotels.forEach(hotel => {
            body.push({
                delete: {
                    _index: HOTEL_INDEX_NAME,
                    _id: hotel.id
                }
            });
        });

        const response = await this.esClient.bulk({ refresh: true, body });
        console.log('Removed hotels:', response);
        if (response.errors) {
            const erroredDocuments = [];
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        hotel: hotels[i],
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }

}

module.exports = HotelRepository;