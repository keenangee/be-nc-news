const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  fetchCommentByCommentId,
} = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticleId(article_id),
    fetchArticleById(article_id),
  ])
    .then(([comments, article]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  fetchCommentByCommentId(comment_id)
    .then(() => {
      removeCommentById(comment_id).then(() => {
        res.status(204).send();
      });
    })
    .catch((err) => next(err));
};
