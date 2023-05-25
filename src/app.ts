import express from "express";
import serverless from "serverless-http";
import { connectDB } from "./database/connection";
import routes from "./routes";

const app = express();

const cors = require("cors");
app.use(cors());

connectDB();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2mb" }));

app.use("/", routes);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).send();
  }
);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.status || 500).send();
  }
);

export const handler = serverless(app);
