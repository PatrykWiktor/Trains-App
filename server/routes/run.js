import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
  getConnection,
} from "../controllers/run";

router.post("/run/create", create);
router.get("/run/getall", getall);
router.get("/run/get/:id?", getOneById);
router.patch("/run/update/:id?", update);
router.delete("/run/remove/:id?", remove);
router.get("/run/getconnection/:strt?/:end?",getConnection)


module.exports = router;
