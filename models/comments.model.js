const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT *
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC
        `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
