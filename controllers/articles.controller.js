const {
  fetchArticleById,
  fetchArticle,
  updateArticleById,
  insertArticle,
  removeArticleById,
} = require("../models/articles.model");
const {
  checkAllArticleTopics,
  checkColumnExists,
  checkLimitandP,
  calculateStartindexAndEndindex,
} = require("../utils/utils");
const { removeCommentsByArticleId } = require("../models/comments.model");

exports.getArticle = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  const promiseArray = [];

  if (sort_by) {
    promiseArray.push(checkColumnExists("articles", sort_by));
  }

  if (topic) {
    promiseArray.push(checkAllArticleTopics(topic));
  }

  if (limit || p) {
    promiseArray.push(checkLimitandP(limit, p));
  }

  Promise.all(promiseArray)
    .then((result) => {
      if (result.includes(false)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" });
      }
    })
    .then(() => {
      const { startIndex, endIndex } = calculateStartindexAndEndindex(limit, p);
      fetchArticle(sort_by, order, topic, limit, startIndex, endIndex)
        .then(([articles, total_count]) => {
          if (startIndex > total_count) {
            return Promise.reject({
              status: 404,
              msg: `Page ${p} does not exist`,
            });
          }

          res.status(200).send({ articles, total_count });
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

exports.postArticle = (req, res, next) => {
  const { title, topic, author, body, article_img_url } = req.body;
  insertArticle(title, topic, author, body, article_img_url)
    .then((article) => {
      return fetchArticleById(article.article_id).then((article) => {
        res.status(201).send({ article });
      });
    })
    .catch((err) => next(err));
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  async function deleteArticle() {
    try {
      await fetchArticleById(article_id);
      await removeCommentsByArticleId(article_id);
      await removeArticleById(article_id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  deleteArticle();

  // fetchArticleById(article_id)
  //   .then(() => {
  //     removeArticleById(article_id).then(() => {
  //       res.sendStatus(204);
  //     });
  //   })
  //   .catch((err) => next(err));
};
