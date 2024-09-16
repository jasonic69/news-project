const express = require('express');
const app = express();

const {getApiDetails} = require('./controllers/apis-controllers');
const {getTopics} = require('./controllers/topics-controllers');
const {getArticleById, getArticles, getArticleCommentsById, postArticleCommentById, patchArticleVotesById} = require('./controllers/articles-controllers');
const {deleteCommentById} = require('./controllers/comments-controllers');
const {getUsers} = require('./controllers/users-controllers');

const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/api', getApiDetails);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getArticleCommentsById);
app.post('/api/articles/:article_id/comments', postArticleCommentById);
app.patch('/api/articles/:article_id', patchArticleVotesById);
app.delete('/api/comments/:comment_id', deleteCommentById);
app.get('/api/users', getUsers);
//app.get('/api/users/:username', getUser);



app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23503"){
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err); 
    }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
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