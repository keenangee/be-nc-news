# BACKEND EXPRESS.JS API APP

## Live Version

Link to hosted version [here!](https://nc-newz.onrender.com/api)

## Summary

This is a backend API app built with [express.js](https://expressjs.com/) designed to interact with the Front End of my 'nc-newz' website. The database is ran using PSQL, and currently stores data tables for info on articles, comments, topics and users.

## Cloning and Installation

To clone and install this app on your local machine, follow these steps:

1. Clone the [repo](https://github.com/keenangee/be-nc-news): `git clone https://github.com/keenangee/be-nc-news`

2. Install dependencies: `npm install`

## Environment Variables

This app uses two `.env` files:

1. `.env.development` file for the development environment

2. `.env.test` file for the test environment

## Local Database Setup

To seed the local database, follow these steps:

1. Create a `.env.development` file in your root for the development environment (see `.env-example` for example)

2. Run the database setup: `npm run setup-dbs`

3. Seed the database: `npm run seed`

## Running Tests

To run tests, follow these steps:

1. Create a `.env.test` file in your root for the test environment (see `.env-example` for example)

2. Run the tests: `npm test`

## Running the app locally

To run the app locally, follow these steps:

1. Check/change the `PORT` in the `listen.js` file if necessary, it is currently set to `7070`

2. Run the start script: `npm start`

3. The app will then be available at `http://localhost:7070/api`

## Minimum Requirements

This app requires the following versions of Node.js and Postgres:

- Node.js version: v19+ recommended
- Postgres version: v15+ recommended
