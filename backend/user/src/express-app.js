const express = require('express');
const cors  = require('cors');
const { user, appEvents } = require('./api');
const { CreateChannel, SubscribeMessage } = require('./utils')

module.exports = async (app,channel) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    //api
    // appEvents(app);
    
    user(app, channel);
    // error handling
    
}
