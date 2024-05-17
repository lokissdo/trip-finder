const Attraction = require('../models/Attraction'); // Import Attraction model
const elasticsearch = require('elasticsearch'); // Assuming you have Elasticsearch installed
const { ELASTICSEARCH_URL } = require('../../config');
const mongoose = require('mongoose');
const ATTRACTION_INDEX_NAME = 'attractions'

class AttractionRepository {

    constructor() {
        this.esClient = new elasticsearch.Client({
            host: ELASTICSEARCH_URL // Replace with your Elasticsearch connection details
        });
    }

    async createIndexMapping() {
        const indexExists = await this.esClient.indices.exists({ index: ATTRACTION_INDEX_NAME });
        if (!indexExists) {
            await this.esClient.indices.create({
                index: ATTRACTION_INDEX_NAME,
                body: {
                    mappings: {
                        properties: {
                            name: { type: 'text' },
                            province: { type: 'keyword' },
                            location: { type: 'geo_point' }, // Geolocation field
                            price: { type: 'float' },
                            platform: { type: 'text' },
                        }
                    }
                }
            });
        }
    }

    async indexDataWithinDateRange(startDate, endDate) {
        await this.createIndexMapping();
        const attractions = await Attraction.find({
            updatedAt: { $gte: startDate, $lte: endDate }
        });

        // Initialize an array to hold bulk operations
        const body = [];

        // Build the bulk request
        attractions.forEach(attraction => {
            const esDocument = {
                name: attraction.name,
                province: attraction.province,
                price: attraction.price,
                platform: attraction.platform
            };
        
            // Only add location if both lat and long are available
            if (attraction.lat  && attraction.long) {
                esDocument.location = {
                    lat: attraction.lat,
                    lon: attraction.long
                };
            }
        
            body.push({ index: { _index: ATTRACTION_INDEX_NAME, _id: attraction.id } });
            body.push(esDocument);
        });

        // Perform the bulk indexing
        const response = await this.esClient.bulk({ refresh: true, body });

        console.log('Indexed attractions:', response);
        if (response.errors) {
            const erroredDocuments = []
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0]
                if (action[operation].error) {
                    erroredDocuments.push({
                        // Original Attraction object causing the error
                        attraction: attractions[i],
                        // Error causing the failure
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred:', erroredDocuments);
        }
    }

    async removeIndexBeforeDate(beforeDate) {
        const attractions = await Attraction.find({
            updatedAt: { $lt: beforeDate }
        });

        console.log('Found attractions to remove:', attractions.length, 'documents');

        const body = [];
        attractions.forEach(attraction => {
            body.push({ 
                delete: { _index: ATTRACTION_INDEX_NAME, _id: attraction._id } 
            });
        });

        const response = await this.esClient.bulk({ refresh: true, body });
        console.log('Removed attractions:', response);

        if (response.errors) {
            const erroredDocuments = [];
            response.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        attraction: attractions[i],
                        error: action[operation].error
                    });
                }
            });
            console.log('Errors occurred while removing:', erroredDocuments);
        }
    }



}

module.exports = AttractionRepository;