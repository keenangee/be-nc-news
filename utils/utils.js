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

exports.checkLimitandP = (limit, p) => {
  if (limit && isNaN(limit)) {
    return Promise.reject({ status: 400, msg: "Invalid limit query" });
  }
  if (p && isNaN(p)) {
    return Promise.reject({ status: 400, msg: "Invalid page query" });
  }

  return Promise.resolve(true);
};

exports.calculateStartindexAndEndindex = (limit = 10, p = 1) => {
  const startIndex = limit * (p - 1);
  const endIndex = limit * p;

  return { startIndex, endIndex };
};
