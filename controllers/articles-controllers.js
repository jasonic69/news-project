const {selectArticle,selectArticles, selectComments, postComment, patchArticleVotes} = require('../models/articles-models');

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticle(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query
   
    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleCommentsById = (req, res, next) => {
    const {article_id} = req.params
    selectComments(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postArticleCommentById = (req, res, next) => {
    const postDetails = req.body
    const {article_id} = req.params

    postComment(article_id, postDetails ).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotesById = (req, res, next) => {
    const postDetails = req.body
    const {article_id} = req.params

    patchArticleVotes(article_id, postDetails ).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}