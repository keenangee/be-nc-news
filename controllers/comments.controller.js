const { fetchCommentsByArticleId } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticleId(article_id),
    fetchArticleById(article_id),
  ])
    .then(([comments, article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};
