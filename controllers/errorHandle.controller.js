exports.RouteNotFoundError = (err, req, res, next) => {
  const { status = 404, msg } = err;
  res.status(status).send({ msg });
};

exports.serverError500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
