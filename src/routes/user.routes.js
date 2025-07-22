import express from "express";
import { login, signIn } from "../Controllers/user.controllers.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/login", login);

export default router;
