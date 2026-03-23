import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import notFound from "./app/middlewares/notFound.js";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
import router from "./app/routes/index.js";
import expressSession from "express-session";
import { envVars } from "./app/config/env.js";
import passport from "passport";
import { configurePassport } from "./app/config/passport.js";

const app: Application = express();

// Passport auth middleware
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// For accessing the cookie
app.use(cookieParser());
// For json data
app.use(express.json());
// For url encoded data
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Allow all origins
  credentials: true, // Allow cookies and credentials to be sent
};
// For allowing frontend to access backend
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

// Route start with "api/v1"
app.use("/api/v1/", router);

// Middlewares
app.use(notFound);
app.use(globalErrorHandler);

export default app;
