const {selectArticle,selectArticles, selectComments} = require('../models/articles-models');

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
    selectArticles().then((articles) => {
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