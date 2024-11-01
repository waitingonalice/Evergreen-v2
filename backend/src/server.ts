import { pg } from "./db";
import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import fs from "fs";
import { Env } from "./utils";
import { V1Router } from "./routes/v1";
import { errorHandler } from "./utils/errorHandler";

const initServer = () => {
  if (!Env.PORT) {
    console.error("PORT is not defined");
    process.exit(1);
  }

  const app = express();

  const allowList = [Env.FRONTEND_URL];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }
        if (allowList.indexOf(origin) === -1) {
          const message = `The CORS policy for this site does not allow access from the specified Origin.`;
          return callback(new Error(message), false);
        } else {
          return callback(null, true);
        }
      },
    }),
  );

  app.use(express.json());
  app.use(helmet());

  app.get("/", (_: Request, res: Response) => {
    pg.clientHealthCheck();
    const welcomeTemplate = fs.readFileSync(
      `${__dirname}/static/templates/welcome.html`,
      "utf-8",
    );
    res.send(welcomeTemplate);
  });

  app.use("/api/v1", V1Router);
  app.use(errorHandler);

  app.listen(Env.PORT, () => {
    console.log(`Listening on port ${Env.PORT}`);
  });
};

initServer();
