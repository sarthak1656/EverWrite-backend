import { Router } from "express";
import { CreateAccount, getUser, Login } from "../controllers/user.controller.js";
import authenticateToken from "../middlewares/utilities.js";

const userRouter = Router();

userRouter.post("/create-account", CreateAccount);
userRouter.post("/login", Login);
userRouter.get("/get-user",authenticateToken ,getUser);

export default userRouter;
