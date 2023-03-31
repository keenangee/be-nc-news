const db = require("../db/connection");

exports.fetchUsers = () => {
  return db
    .query(
      `
    SELECT *
    FROM users
        `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `
    SELECT *
    FROM users
    WHERE username = $1
    `,
      [username]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      } else {
        return result.rows[0];
      }
    });
};
