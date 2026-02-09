import type { Server } from "node:http";
import app from "./app.js";

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
})();
