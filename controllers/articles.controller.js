const {
  fetchArticleById,
  fetchArticle,
  updateArticleById,
} = require("../models/articles.model");
const { checkAllArticleTopics, checkColumnExists } = require("../utils/utils");

exports.getArticle = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  const promiseArray = [];

  if (sort_by) {
    promiseArray.push(checkColumnExists("articles", sort_by));
  }

  if (topic) {
    promiseArray.push(checkAllArticleTopics(topic));
  }

  Promise.all(promiseArray)
    .then((result) => {
      if (result.includes(false)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" });
      }
    })
    .then(() => {
      fetchArticle(sort_by, order, topic)
        .then((articles) => {
          res.status(200).send({ articles });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};
