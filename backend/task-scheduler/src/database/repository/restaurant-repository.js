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

    async indexDataWithinDateRange(startDate, endDate) {
        await this.createIndexMapping();
        const restaurants = await Restaurant.find({
            updatedAt: { $gte: startDate, $lte: endDate }
        });
        console.log('Indexing restaurants:', restaurants.length, 'documents');
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



    async removeIndexBeforeDate(beforeDate) {
        const restaurants = await Restaurant.find({
            updatedAt: { $lt: beforeDate }
        });

        console.log('Found restaurants to remove:', restaurants.length, 'documents');

        const body = [];
        restaurants.forEach(restaurant => {
            body.push({
                delete: {
                    _index: RESTAURANT_INDEX_NAME,
                    _id: restaurant.id
                }
            });
        });

        const response = await this.esClient.bulk({ refresh: true, body });
        console.log('Removed documents from Elasticsearch:', response);

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
            console.log('Errors occurred while removing:', erroredDocuments);
        }
    }

   
}

module.exports = RestaurantRepository;
