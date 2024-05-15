const express = require('express');
const cors  = require('cors');
const { search, indexing } = require('./api');
const { CreateChannel, SubscribeMessage } = require('./utils')

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))


    const channel = await CreateChannel()

    
    search(app, channel);
    indexing(app, channel);

    // error handling
    
}
