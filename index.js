const express = require("express");
const bodyParser = require("body-parser");
const { models } = require("./config/sequelize-config");
const cors = require("cors");
const config = require("./config/config");

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { errorHandler } = require("./middlewares/errorHandler.middleware");
const { notfound } = require("./middlewares/notFound.middleware");
const userRouter = require("./routes/user.routes");
const movieRouter = require("./routes/movies.routes");
const ratingRouter = require("./routes/rating.routes");
const uploadRouter = require("./routes/uploads.routes");
const app = express();
app.use(cors());
app.use(jsonParser);
app.use(urlencodedParser);
app.use("/uploads", express.static(__dirname + "/uploads"));
//Use Routes
app.use("/", userRouter);
app.use("/", movieRouter);
app.use("/", ratingRouter);
app.use("/", uploadRouter);
//Use middlewares
app.use(notfound);
app.use(errorHandler);
app.listen(config.port, config.host, () => {
  console.log(`Server running at http://${config.host}:${config.port}/`);
});
