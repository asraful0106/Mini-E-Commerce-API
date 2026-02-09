import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./app/middlewares/notFound.js";

const app: Application = express();

// For accessing the cookie
app.use(cookieParser());
// For json data
app.use(express.json());
// For url encoded data
app.use(express.urlencoded({ extended: true }));

// For allowing frontend to access backend
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

// Middlewares
app.use(notFound);

export default app;
