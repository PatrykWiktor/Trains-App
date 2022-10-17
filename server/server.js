import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();
const csrfProtection = csrf({ cookie: true });


// express app
const app = express();

//DB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  })
  .then(() => console.log("db connected"))
  .catch((err) => console.log("db connection error", err));

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
//route
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);
//csrf
app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => [
  res.json({ csrfToken: req.csrfToken() }),
]);
//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server is running on port ${port}`));
