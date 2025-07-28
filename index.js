import express from "express";
import dotenv from "dotenv";
import router from "./src/routes/user.routes.js";
import loanRouter from "./src/routes/loan.routes.js";
import cors from "cors";
import connectdb from "./src/db/database.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://microfinance-app-frontend-phi.vercel.app",
      "https://microfinance-app-dashboard.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("HELLO SERVER");
});
app.use("/api/v1", router);
app.use("/api/v2", loanRouter);

connectdb()
  .then(() => {
    app.listen(port, () => {
      console.log("SERVER IS RUNNING AT PORT", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
