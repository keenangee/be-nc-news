const app = require("./app");

const { PORT = 7070 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
