const express = require("express");
const {
  RouteNotFoundError,
  serverError500,
  customErrors,
  psql400Error,
  psql404Error,
} = require("./controllers/errorHandle.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticle,
  patchArticleById,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/comments.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticle);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.all("/*", RouteNotFoundError);

app.use(customErrors);
app.use(psql400Error);
app.use(psql404Error);
app.use(serverError500);

module.exports = app;
