const express = require('express');
const cors  = require('cors');
const runAllTasks = require('./task');
const { CreateChannel, SubscribeMessage } = require('./utils')

module.exports = async (app) => {
    //api
    // appEvents(app);

    
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    setTimeout(async () => {
        await runAllTasks();
    }, 5000);

    app.get('/health', (req, res) => {
        res.send('OK');
    });
    
}
