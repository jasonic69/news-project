const db = require("../db/connection");
const { articleData } = require("../db/data/test-data");
const articles = require("../db/data/test-data/articles");
const comments = require("../db/data/test-data/comments");

exports.selectArticle = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1",[article_id]).then(({rows}) => {
        if (rows.length === 0) return Promise.reject({status: 404, msg: "article does not exist" });
        return rows[0];
    });
}

exports.selectArticles = () => {

    const sqlQuery = "SELECT  a.article_id,a.title,a.topic,a.author,a.created_at,a.votes,a.article_img_url,COUNT(b.article_id)::INT  AS comment_count FROM articles a LEFT JOIN comments b ON b.article_id = a.article_id GROUP BY a.article_id, b.article_id ORDER BY a.created_at DESC;"

    return db.query(sqlQuery).then(({rows})=>{
        return rows       
    })
}

exports.selectComments = (article_id) => {
    return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",[article_id]).then(({rows}) => {
        if (rows.length === 0) return Promise.reject({status: 404, msg: "no comments found" });
        return rows;
    });
}

exports.postComment = (article_id, postDetails) => {
    
    return db.query("INSERT INTO comments (article_id, author, body) VALUES ($1,$2,$3) RETURNING *;",
        [article_id, postDetails.username, postDetails.body]).then(({rows}) => {
        return rows[0];
    });
}

exports.patchArticleVotes = (article_id, postDetails) => {

    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
        [postDetails.inc_votes,article_id]).then(({rows}) => {
        
        if (rows.length === 0) return Promise.reject({status: 404, msg: "article does not exist" });
        return rows[0];
    });
}