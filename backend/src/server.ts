import app from "./app";
import { env } from "./config/env";
import { redisClient } from "./config/redis";

async function startServer() {
  try {
    await redisClient.connect();

    console.log("Redis connected");

    app.listen(env.PORT, () => {
      console.log(`Backend running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startServer();