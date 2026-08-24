import express from "express";
import cors from "cors";
import session from "express-session";
import { RedisStore } from "connect-redis";

import passport from "./config/passport";
import { redisClient } from "./config/redis";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import campaignRoutes from "./routes/campaignRoutes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Email Scheduler API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;