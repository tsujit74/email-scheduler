import { emailWorker } from "./services/emailWorker";
import { verifyEmailTransport } from "./services/emailSender";


async function startWorker() {
  try {
    await verifyEmailTransport();

    console.log("Email worker started");

    emailWorker.on("ready", () => {
      console.log("Worker connected to Redis");
    });
  } catch (error) {
    console.error("SMTP verification failed:", error);
    process.exit(1);
  }
}

startWorker();