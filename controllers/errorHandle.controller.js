exports.RouteNotFoundError = (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.psql400Error = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Oops... Bad Request" });
  } else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverError500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Oh no... Internal Server Error!" });
};
