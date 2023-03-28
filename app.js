const express = require("express");
const {
  RouteNotFoundError,
  serverError500,
  customErrors,
  psql400Error,
} = require("./controllers/errorHandle.controller");
const { getTopics } = require("./controllers/topics.controller");
const { getArticleById } = require("./controllers/articles.controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", RouteNotFoundError);

app.use(psql400Error);
app.use(customErrors);
app.use(serverError500);

module.exports = app;
