const db = require("../db/connection");
const { articleNotFoundMsg } = require("../utils/utils");
const { checkAllArticleTopics, checkColumnExists } = require("../utils/utils");

exports.fetchArticle = (sort_by, order, topic) => {
  if (order && order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let selectArticles = `
  SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(count(comments.comment_id)AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;

  let queryParameters = [];

  if (topic) {
    selectArticles += `WHERE articles.topic = $1`;
    queryParameters.push(topic);
  }

  selectArticles += ` GROUP BY articles.article_id`;

  if (sort_by) {
    selectArticles += ` ORDER BY articles.${sort_by} ${order || "ASC"}`;
  } else {
    selectArticles += ` ORDER BY articles.created_at DESC`;
  }

  return db.query(selectArticles, queryParameters).then((result) => {
    if (result.rowCount === 0) {
      return articleNotFoundMsg();
    }
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, CAST(count(comments.comment_id)AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
        `,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return articleNotFoundMsg();
      }
      return result.rows[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE articles.article_id = $2
    RETURNING *
    `,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return articleNotFoundMsg();
      }
      return result.rows[0];
    });
};

exports.insertArticle = (title, topic, author, body, article_img_url) => {
  return db
    .query(
      `
    INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
      [title, topic, author, body, article_img_url]
    )
    .then((result) => {
      return result.rows[0];
    });
};
