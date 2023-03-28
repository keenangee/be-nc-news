const express = require("express");
const {
  RouteNotFoundError,
  serverError500,
  customErrors,
  psql400Error,
} = require("./controllers/errorHandle.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticle,
} = require("./controllers/articles.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticle);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", RouteNotFoundError);

app.use(psql400Error);
app.use(customErrors);
app.use(serverError500);

module.exports = app;
