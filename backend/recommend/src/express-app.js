const express = require('express');
const cors  = require('cors');
const { recommend, dailySchedule } = require('./api');
const { CreateChannel, SubscribeMessage } = require('./utils')

module.exports = async (app,channel) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    
    recommend(app, channel);
    dailySchedule(app, channel);   
    // error handling
    
}
