const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id, startIndex, endIndex) => {
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
      const total_count = result.rowCount;
      const comments = result.rows.slice(startIndex, endIndex);
      return [comments, total_count];
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

exports.fetchCommentByCommentId = (comment_id) => {
  return db
    .query(
      `
      SELECT *
      FROM comments
      WHERE comments.comment_id = $1
          `,
      [comment_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return result.rows[0];
      }
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
      DELETE FROM comments
      WHERE comments.comment_id = $1
      RETURNING *;
          `,
      [comment_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateCommentById = (comment_id, newVotes = 0) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comments.comment_id = $2
      RETURNING *;
          `,
      [newVotes, comment_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      DELETE FROM comments
      WHERE comments.article_id = $1
      RETURNING *;
          `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
