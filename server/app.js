import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import routesLoader from "./loaders/routes.js"
import { corsOptions } from "./config/cors.js";
import { sessionOptions } from "./config/session.js";
import ensureCartId from "./middleware/ensureCartId.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

app.use(cors(corsOptions)); // REACT와 통신 가능하다
app.use(express.json()); // JSON요청을 받을 수 있다
app.use(cookieParser());
app.use(ensureCartId);
app.use(session(sessionOptions));

routesLoader(app);

app.use(notFound);
app.use(errorHandler);

export default app; 