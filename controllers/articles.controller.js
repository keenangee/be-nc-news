const { fetchArticleById, fetchArticle } = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  fetchArticle()
    .then((articles) => {
      res.status(200).send({ articles });
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
