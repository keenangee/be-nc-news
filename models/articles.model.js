const db = require("../db/connection");

exports.fetchArticle = () => {
  return db
    .query(
      `
  SELECT articles.*, CAST(count(comments.comment_id)AS INTEGER) AS comment_count 
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT *
    FROM articles
    WHERE articles.article_id = $1
        `,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};
