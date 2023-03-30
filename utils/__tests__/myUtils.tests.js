const seed = require("../../db/seeds/seed");
const testData = require("../../db/data/test-data");
const db = require("../../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

const { checkAllArticleTopics, checkColumnExists } = require("../utils");

describe("My Utils", () => {
  describe("checkAllArticleTopics", () => {
    it("should return true depending on if the category exists", () => {
      return checkAllArticleTopics("mitch").then((result) => {
        expect(result).toBe(true);
      });
    });
  });
  it("should return false depending on if the category exists", () => {
    return checkAllArticleTopics("nonono").then((result) => {
      expect(result).toBe(false);
    });
  });
  describe("checkColumnExists", () => {
    it("should return true depending on if the column exists", () => {
      return checkColumnExists("articles", "author").then((result) => {
        expect(result).toBe(true);
      });
    });
    it("should return false depending on if the column exists", () => {
      return checkColumnExists("articles", "nonono").then((result) => {
        expect(result).toBe(false);
      });
    });
  });
});
