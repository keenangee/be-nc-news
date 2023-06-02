const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  fetchCommentByCommentId,
  updateCommentById,
} = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");
const {
  checkLimitandP,
  calculateStartindexAndEndindex,
} = require("../utils/utils");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p } = req.query;

  const { startIndex, endIndex } = calculateStartindexAndEndindex(limit, p);

  const promiseArray = [];

  if (limit || p) {
    promiseArray.push(checkLimitandP(limit, p));
  }

  promiseArray.push(fetchArticleById(article_id));

  Promise.all(promiseArray)
    .then((result) => {
      if (result.includes(false)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" });
      }
    })
    .then(() => {
      fetchCommentsByArticleId(article_id, startIndex, endIndex)
        .then(([comments, total_count]) => {
          if (startIndex > total_count) {
            return Promise.reject({
              status: 404,
              msg: `Page ${p} does not exist`,
            });
          }
          res.status(200).send({ comments, total_count });
        })
        .catch((err) => next(err));
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
      const newVotes = inc_votes;
      updateCommentById(comment_id, newVotes).then((comment) => {
        res.status(200).send({ comment });
      });
    })
    .catch((err) => next(err));
};
