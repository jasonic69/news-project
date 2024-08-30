const db = require("../db/connection");

exports.selectArticle = (article_id) => {

    const sqlQuery = "SELECT  a.*,COUNT(b.article_id)::INT AS comment_count FROM articles a LEFT JOIN comments b ON b.article_id = a.article_id WHERE a.article_id = $1 GROUP BY a.article_id"

    return db.query(sqlQuery,[article_id]).then(({rows}) => {
        if (rows.length === 0) return Promise.reject({status: 404, msg: "article does not exist" });
        return rows[0];
    });
}

exports.selectArticles = (sort_by='created_at', order='desc', topic) => {

    const validSortByColumns = [
        "article_id",
        "title",
        "topic",
        "author",
        "created_at",
        "votes",
        "article_img_url",
        "comment_count"
    ]

    const validTopics = [  
        "mitch",
        "cats",
        "paper"
    ]

    const validOrders = [  
        "desc",
        "asc"
    ]
    

    let sqlQuery = "SELECT  a.article_id,a.title,a.topic,a.author,a.created_at,a.votes,a.article_img_url,COUNT(b.article_id)::INT AS comment_count FROM articles a LEFT JOIN comments b ON b.article_id = a.article_id "


    if (topic){
        if (!validTopics.includes(topic)){
            return Promise.reject({status: 400 , msg: 'Bad request'})
        } else {
            sqlQuery += ` WHERE topic = '${topic}'`
        }
    }

    sqlQuery += " GROUP BY a.article_id, b.article_id"

    if (sort_by){
        if (!validSortByColumns.includes(sort_by)){
            return Promise.reject({status: 400 , msg: 'Bad request'})
        } else {
            sqlQuery += ` ORDER BY ${sort_by}`
        }
    }

    if (order){
        if (!validOrders.includes(order)){
            return Promise.reject({status: 400 , msg: 'Bad request'})
        } else {
            sqlQuery += ` ${order}`
        }
    }

    return db.query(sqlQuery).then(({rows})=>{
        if (rows.length === 0) return Promise.reject({status: 200, msg: "No articles found" });
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