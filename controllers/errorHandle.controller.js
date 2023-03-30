exports.routeNotFoundError = (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psql400Error = (err, req, res, next) => {
  const psqlCodes = ["22P02", "23502", "42601"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.psql404Error = (err, req, res, next) => {
  const psqlCodesNotFound = ["23503"];
  if (psqlCodesNotFound.includes(err.code)) {
    const psqlDetailWord = err.detail.match(/\(\w+\)/g)[0].slice(1, -1) || null;
    res.status(404).send({ msg: `${psqlDetailWord} not found` });
  } else {
    next(err);
  }
};

exports.serverError500 = (err, req, res, next) => {
  console.log(err); // dev tool
  res.status(500).send({ msg: "Oh no... Internal Server Error!" });
};
