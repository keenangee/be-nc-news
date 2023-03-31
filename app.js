const express = require("express");
const apiRouter = require("./routes/api-router");

const {
  routeNotFoundError,
  serverError500,
  customErrors,
  psql400Error,
  psql404Error,
} = require("./controllers/errorHandle.controller");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", routeNotFoundError);

app.use(customErrors);
app.use(psql400Error);
app.use(psql404Error);
app.use(serverError500);

module.exports = app;
