const express = require('express');
const app = express();

const {getApiDetails} = require('./controllers/apis-controllers');
const {getTopics} = require('./controllers/topics-controllers');



app.get('/api', getApiDetails);

app.get('/api/topics', getTopics);



app.all('/*',(req , res) => {
    res.status(404).send({ msg: "Route Not Found" });
})

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = app;