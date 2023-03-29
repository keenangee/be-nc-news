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

exports.insertCommentByArticleId = (article_id, username, body) => {
  return db
    .query(
      `
          INSERT INTO comments (author, article_id, body)
          VALUES ($1, $2, $3)
          RETURNING *;
              `,
      [username, article_id, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};
