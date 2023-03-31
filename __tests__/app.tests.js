const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("nc news app", () => {
  describe("GET /api/topics", () => {
    test('status: 200, responds with an object containing a key of "topics" and a value of an array of objects', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("topics");

          expect(body.topics).toBeInstanceOf(Array);
          expect(body.topics[0]).toBeInstanceOf(Object);
        });
    });
    test('status: 200, the value of the key "topics" should be an object containing an array of topic objects', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).toHaveLength(3);
          body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    test("status: 404, responds with an error message if end point is not correct (typo in url)", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Route not found",
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test('status: 200, responds with an object containing a key of "article" and a value of an object', () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("article");
          expect(body.article).toBeInstanceOf(Object);
        });
    });
    test("status: 200, responds with the correct article details matched with the article that has the id of 1", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("status: 200, responds with the correct article details matched with the article that has the id of 7", () => {
      return request(app)
        .get("/api/articles/7")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 7,
            author: "icellusedkars",
            title: "Z",
            body: "I was hungry.",
            topic: "mitch",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("status: 404, responds with an error message if the article id is not found, but is a valid number", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Article not found",
          });
        });
    });
    test("status: 400, responds with an error message if the article id is not a number", () => {
      return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
  });
  describe("GET /api/articles", () => {
    test('status: 200, responds with an object containing a key of "articles" and a value of an array of objects', () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("articles");
          expect(body.articles).toBeInstanceOf(Array);
          expect(body.articles[0]).toBeInstanceOf(Object);
        });
    });
    test("status: 200, responds with an array of article objects with the correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(12);
          body.articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("status: 200, responds with the correct comment count for article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const article9 = body.articles.find(
            (article) => article.article_id === 9
          );
          const article6 = body.articles.find(
            (article) => article.article_id === 6
          );

          expect(article9.comment_count).toBe(2);
          expect(article6.comment_count).toBe(1);
        });
    });
    test("status: 200, responds with an array of article objects sorted by 'created_at' in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("status: 404, responds with an error message if end point is not correct (typo in url)", () => {
      return request(app)
        .get("/api/articles-typo")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Route not found",
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test('status: 200, responds with an object containing a key of "comments" and a value of an array of objects', () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("comments");
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments[0]).toBeInstanceOf(Object);
        });
    });
    test("status: 200, responds with an array of comments that match the article id of 3", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 3,
            });
          });
        });
    });
    test("status: 200, responds with an array of comments that match the article id of 9", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toHaveLength(2);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 9,
            });
          });
        });
    });
    test("status: 200, responds with an empty array when article id exists but there are no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("status: 404, responds with an error message if the article id is not found, but is a valid number", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Article not found",
          });
        });
    });
    test("status: 400, responds with an error message if the article id is not a number", () => {
      return request(app)
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test('status: 201, responds with an object containing a key of "comment" and a value of an object', () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Test comment" })
        .expect(201)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("comment");
          expect(body.comment).toBeInstanceOf(Object);
        });
    });
    test("status: 201, responds with an object with the correct keys and values types", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Test comment" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("status: 201, responds with an object with the correct keys and specific values for the sent comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "Test comment" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 19,
            author: "butter_bridge",
            body: "Test comment",
            article_id: 1,
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("status: 400, responds with an error message if the article id is not a number", () => {
      return request(app)
        .post("/api/articles/not-a-number/comments")
        .send({ username: "butter_bridge", body: "Test comment" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 404, responds with an error message if the article id is not found, but is a valid number", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({ username: "butter_bridge", body: "Test comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "article_id not found",
          });
        });
    });
    test("status: 404, responds with an error message if the username is not found", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "not-a-username", body: "Test comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "author not found",
          });
        });
    });
    test("status: 400, responds with an error message if the body is missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 400, responds with an error message if the username is missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "Test comment" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("status: 200, responds with an object containing a key of 'article' and a value of an object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("article");
          expect(body.article).toBeInstanceOf(Object);
        });
    });
    test("status: 200, responds with an object with the correct keys and values types", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
          });
        });
    });
    test("status: 200, responds with an object with the correct keys and specific values with the vote count increased", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 3 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 103,
            topic: "mitch",
          });
        });
    });
    test("status: 200, responds with an object with the correct keys and specific values with the vote count decreased", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -50 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 50,
            topic: "mitch",
          });
        });
    });
    test("status: 400, responds with an error message if the article id is not a number", () => {
      return request(app)
        .patch("/api/articles/not-a-number")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 404, responds with an error message if the article id is not found, but is a valid number", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Article not found",
          });
        });
    });
    test("status: 400, responds with an error message if the inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "not-a-number" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 400, responds with an error message if the inc_votes is missing", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("status: 204, responds with no content", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    test("status: 400, responds with an error message if the comment id is not a number", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 404, responds with an error message if the comment id is not found, but is a valid number", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Comment not found",
          });
        });
    });
  });
  describe("GET /api/users", () => {
    test("status: 200, responds with an object containing a key of 'users' and a value of an array of objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("users");
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users[0]).toBeInstanceOf(Object);
        });
    });
    test("status: 200, responds with an array of objects with the correct keys and values types", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String),
            });
          });
        });
    });
    test("status: 404, responds with an error message if end point is not correct (typo in url)", () => {
      return request(app)
        .get("/api/users-typo")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Route not found",
          });
        });
    });
  });
  describe("GET  /api/articles QUERIES", () => {
    describe("GET /api/articles?topic=", () => {
      test("status: 200, responds with an object containing a key of 'articles' and a value of an array of objects", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body)[0]).toBe("articles");
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles[0]).toBeInstanceOf(Object);
          });
      });
      test("status: 200, responds with an array of objects with the correct keys and values types", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(1);
            body.articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      test("status: 400, responds with an error message if the topic is not found (typo or invalid query)", () => {
        return request(app)
          .get("/api/articles?topic=not-a-topic")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Invalid sort query",
            });
          });
      });
    });
    describe("GET /api/articles?sort_by=", () => {
      test("status: 200, responds with an object containing a key of 'articles' and a value of an array of objects", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body)[0]).toBe("articles");
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles[0]).toBeInstanceOf(Object);
          });
      });
      test("status: 200, responds with an array of objects with the correct keys and values types", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(12);
            body.articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      test("status: 200, responds with an array that is sorted correctly depending on the sort query - AUTHOR", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("author", {
              descending: false,
            });
          });
      });
      test("status: 200, responds with an array that is sorted correctly depending on the sort query - TITLE", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title", {
              descending: false,
            });
          });
      });
      test("status: 400, responds with an error message if the column to be sorted is not found (typo or invalid query)", () => {
        return request(app)
          .get("/api/articles?sort_by=not-a-column")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Invalid sort query",
            });
          });
      });
    });
    describe("GET /api/articles?order=", () => {
      test("status: 200, responds with an object containing a key of 'articles' and a value of an array of objects", () => {
        return request(app)
          .get("/api/articles?sort_by=author&&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body)[0]).toBe("articles");
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles[0]).toBeInstanceOf(Object);
          });
      });
      test("status: 200, responds with an array of objects with the correct keys and values types", () => {
        return request(app)
          .get("/api/articles?sort_by=author&&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toHaveLength(12);
            body.articles.forEach((article) => {
              expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              });
            });
          });
      });
      test("status: 200, responds with an array that is sorted by author and ordered correctly ASC", () => {
        return request(app)
          .get("/api/articles?sort_by=author&&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("author", {
              descending: false,
            });
          });
      });
      test("status: 200, responds with an array that is sorted by author and ordered correctly DESC", () => {
        return request(app)
          .get("/api/articles?sort_by=title&&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title", {
              descending: true,
            });
          });
      });
      test("status: 400, responds with an error message if the order by is anything other than 'asc' or 'desc'", () => {
        return request(app)
          .get("/api/articles?sort_by=title&&order=sideways")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Invalid order query",
            });
          });
      });
    });
    describe("GET /api/articles query sql injection", () => {
      test("status: 400, responds with an error if the queries are anything other than the allowed words", () => {
        return request(app)
          .get("/api/articles?sort_by=author; DROP TABLE articles;")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Invalid sort query",
            });
          });
      });
      test("status: 400, responds with an error if the queries are anything other than the allowed words", () => {
        return request(app)
          .get("/api/articles?topic=mitch; DROP TABLE articles;")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({
              msg: "Invalid sort query",
            });
          });
      });
    });
  });
  describe("GET /api/articles/:article_id UPDATE (comment count)", () => {
    test("status: 200, responds with an object containing a key of 'article' and a value of an object which now also has a 'comment_count' key with the correct value", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("article");
          expect(body.article).toBeInstanceOf(Object);
          expect(body.article).toMatchObject({
            comment_count: expect.any(Number),
          });
        });
    });
    test("status: 200, responds with the correct article details matched with the article that has the id of 1 and also now has COMMENT COUNT", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 1,
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 11,
          });
        });
    });
    test("status: 200, responds with the correct article details matched with the article that has the id of 7 and also now has COMMENT COUNT", () => {
      return request(app)
        .get("/api/articles/7")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 7,
            author: "icellusedkars",
            title: "Z",
            body: "I was hungry.",
            topic: "mitch",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          });
        });
    });
  });
  describe("GET /api", () => {
    test("status: 200, responds with a JSON file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("endpoints");
        });
    });
    test("status: 200, the 'endpoint' will have a value of an array of objects", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toBeInstanceOf(Array);
          expect(body.endpoints[0]).toBeInstanceOf(Object);
        });
    });
    test("status 404, responds with an error message if there is a typo in path", () => {
      return request(app)
        .get("/api-typo")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Route not found",
          });
        });
    });
  });
  describe("GET /users/:username", () => {
    test("status: 200, responds with an object containing a key of 'user' and a value of an object with the correct keys and values", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("user");
          expect(body.user).toBeInstanceOf(Object);
          expect(body.user).toMatchObject({
            username: "butter_bridge",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            name: "jonny",
          });
        });
    });
    test("status: 404, responds with an error message if the username does not exist", () => {
      return request(app)
        .get("/api/users/does_not_exist")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "User not found",
          });
        });
    });
  });
  describe("PATCH /api/comments/:comment_id", () => {
    test("status: 200, responds with an object containing a key of 'comment' and a value of an object with the correct keys and values", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("comment");
          expect(body.comment).toBeInstanceOf(Object);
          expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("status: 200, responds with the correct comment details matched with the comment that has the id of 1 and the votes increased", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 42,
            created_at: expect.any(String),
          });
        });
    });
    test("status: 200, responds with the correct comment details matched with the comment that has the id of 2 and the votes decreased", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 22,
            created_at: expect.any(String),
          });
        });
    });
    test("status: 400, responds with an error message if the request body is not formatted correctly", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "10" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 404, responds with an error message if the comment_id does not exist", () => {
      return request(app)
        .patch("/api/comments/1000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Comment not found",
          });
        });
    });
    test("status: 400, responds with an error message if the comment_id is not a number", () => {
      return request(app)
        .patch("/api/comments/not_a_number")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
  });
  describe("POST /api/articles", () => {
    test("status: 201, responds with an object containing a key of 'article' and a value of an object with the correct keys and values", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "test_article",
          topic: "mitch",
          author: "butter_bridge",
          body: "test body",
          article_img_url: "https://www.test.com",
        })
        .expect(201)
        .then(
          ({ body }) => (
            expect(Object.keys(body)[0]).toBe("article"),
            expect(body.article).toBeInstanceOf(Object),
            expect(body.article).toMatchObject({
              article_id: expect.any(Number),
              title: "test_article",
              topic: "mitch",
              author: "butter_bridge",
              body: "test body",
              created_at: expect.any(String),
              votes: 0,
              article_img_url: "https://www.test.com",
              comment_count: 0,
            })
          )
        );
    });
    test("status: 400, responds with an error message if the request body is not formatted correctly", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "Test Article",
          topic: "test_topic",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Bad Request",
          });
        });
    });
    test("status: 404, responds with an error message if the topic doesn't exist", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "test_article",
          topic: "not_a_topic",
          author: "butter_bridge",
          body: "test body",
          article_img_url: "https://www.test.com",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "topic not found",
          });
        });
    });
    test("status: 404, responds with an error message if the author doesn't exist", () => {
      return request(app)
        .post("/api/articles")
        .send({
          title: "test_article",
          topic: "mitch",
          author: "not_an_author",
          body: "test body",
          article_img_url: "https://www.test.com",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "author not found",
          });
        });
    });
  });
});
