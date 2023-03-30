const db = require("../db/connection");

exports.articleNotFoundMsg = () => {
  return Promise.reject({ status: 404, msg: "Article not found" });
};

exports.checkAllArticleTopics = (topic) => {
  return db
    .query(
      `
    SELECT topic
    FROM articles
    `
    )
    .then((result) => {
      const topics = result.rows.map((article) => article.topic);
      return topics.includes(topic);
    });
};

exports.checkColumnExists = (table, column) => {
  return db
    .query(
      `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1
    `,
      [table]
    )
    .then((result) => {
      const columns = result.rows.map((column) => column.column_name);
      return columns.includes(column);
    });
};
