import type { Server } from "node:http";
import app from "./app.js";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin.js";

let server: Server;
const PORT = 4000;

const startServer = async () => {
  try {
    server = app.listen(PORT, () =>
      console.log(`Server is running at port: ${PORT}`),
    );
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  await startServer();
    await seedSuperAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected.... Server shuting down!", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception detected.... Server shuting down!", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM detected.... Server is shuting down!");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
