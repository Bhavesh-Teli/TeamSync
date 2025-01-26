import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/db.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enums";
import { HTTPSTATUS } from "./config/http.config";
import authRoutes from "./routes/auth.route";
import "./config/passport.config";
import passport from "passport";
const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.get('/',asyncHandler(async (req:Request,res:Response,next:NextFunction)=>{

    throw new BadRequestException(
      "This is a bad request",ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({message:"hhelldow"})
 
 
}))
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`
  );
  await connectDatabase();
});
