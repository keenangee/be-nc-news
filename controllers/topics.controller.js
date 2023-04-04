const { fetchTopics, insertTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.postTopics = (req, res, next) => {
  const { slug, description } = req.body;
  if (slug && description) {
    insertTopic(slug, description)
      .then((topic) => {
        res.status(201).send({ topic });
      })
      .catch((err) => next(err));
  } else {
    next({ status: 400, msg: "Bad Request" });
  }
};
