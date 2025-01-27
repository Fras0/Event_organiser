const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Database connected Successfully!"))
  .catch((e) => console.log(e));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
