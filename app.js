const express = require("express");
const {
  RouteNotFoundError,
  serverError500,
} = require("./controllers/errorHandle.controller");
const { getTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api", (req, res, next) => {
  res.status(200).send({ msg: "Server is up and running" }).catch(next);
});

app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
  next({ status: 404, msg: "Route not found" });
});

app.use(RouteNotFoundError);
app.use(serverError500);

module.exports = app;
