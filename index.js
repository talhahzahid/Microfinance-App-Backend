import express from "express";
import dotenv from "dotenv";
import router from "./src/routes/user.routes.js";
import { connect } from "mongoose";
import connectdb from "./src/db/database.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("HELLO SERVER");
});
app.use("/api/v1", router);

connectdb()
  .then(() => {
    app.listen(port, () => {
      console.log("SERVER IS RUNNING AT PORT", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
