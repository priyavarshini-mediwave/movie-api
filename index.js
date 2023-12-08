const express = require("express");
const bodyParser = require("body-parser");
const { models } = require("./config/sequelize-config");

const config = require("./config/config");

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const { notfound } = require("./middlewares/notFound.middleware");
const userRouter = require("./routes/user.routes");
const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use("/", userRouter);
app.use(notfound);
app.use(errorHandler);
app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`);
});
