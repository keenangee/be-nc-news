const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  fetchCommentByCommentId,
  updateCommentById,
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

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Bad Request" });
  }
  fetchCommentByCommentId(comment_id)
    .then((comment) => {
      const newVotes = comment.votes + inc_votes;
      updateCommentById(comment_id, newVotes).then((comment) => {
        res.status(200).send({ comment });
      });
    })
    .catch((err) => next(err));
};
