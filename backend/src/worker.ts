import { emailWorker } from "./services/emailWorker";
import { verifyEmailTransport } from "./services/emailSender";

async function startWorker() {
  console.log("Starting email worker...");

  try {
    await verifyEmailTransport();
    console.log("SMTP connection verified");
  } catch (error) {
    console.error("SMTP verification failed:", error);
    console.log("Worker will continue running and retry SMTP when processing jobs.");
  }

  emailWorker.on("ready", () => {
    console.log("Worker connected to Redis");
  });

  emailWorker.on("completed", (job) => {
    console.log(`Email job completed: ${job.id}`);
  });

  emailWorker.on("failed", (job, error) => {
    console.error(`Email job failed: ${job?.id}`, error);
  });

  emailWorker.on("error", (error) => {
    console.error("Worker error:", error);
  });

  console.log("Email worker started");
}

startWorker().catch((error) => {
  console.error("Worker startup error:", error);
});