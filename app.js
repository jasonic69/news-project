const express = require('express');
const app = express();

const {getApiDetails} = require('./controllers/apis-controllers');
const {getTopics} = require('./controllers/topics-controllers');
const {getArticleById} = require('./controllers/articles-controllers');



app.get('/api', getApiDetails);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);


app.use((err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err); 
    }
});

app.use((err, req, res, next) => {
    if (err.msg === "article does not exist"){
        res.status(404).send({msg: err.msg});
    } else {
        next(); 
    }
});

app.all('/*',(req , res) => {
    res.status(404).send({ msg: "Route Not Found" });
})

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = app;