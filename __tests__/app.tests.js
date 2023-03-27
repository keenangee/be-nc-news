const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("nc news app", () => {
  describe("GET /api", () => {
    test("status: 200, responds with a JSON describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Server is up and running",
          });
        });
    });
    test("status: 404, responds with error message when a bad endpoint is used (typo in url)", () => {
      return request(app)
        .get("/api/bad")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            msg: "Route not found",
          });
        });
    });
  });

  describe("GET /api/topics", () => {
    test('status: 200, responds with an object containing a key of "topics" and a value of an object', () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)[0]).toBe("topics");

          expect(body.topics).toBeInstanceOf(Object);
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
});
