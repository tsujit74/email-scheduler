import { emailWorker } from "./services/emailWorker";

console.log("Email worker started");

emailWorker.on("ready", () => {
  console.log("Worker connected to Redis");
});