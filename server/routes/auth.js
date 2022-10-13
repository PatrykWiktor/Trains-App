import express from "express";
const router = express.Router();

//middlware
import {requireSignin} from '../middleware/index'

//controllers
import { register, login, logout, currentUser } from "../controllers/auth";

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/logout", logout)
router.get("/user/current-user",requireSignin,currentUser)
module.exports = router;
