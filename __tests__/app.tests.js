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
            msg: "Oops... Bad Request",
          });
        });
    });
  });
});
