import express from "express";
import { signIn } from "../Controllers/user.controllers.js";

const router = express.Router();

router.post("/signin", signIn);

export default router;
