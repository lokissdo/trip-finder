const express = require('express');
const cors  = require('cors');
const { search, indexing } = require('./api');

module.exports = async (app) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    
    search(app);
    indexing(app);

    // error handling
    
}
