import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
  getPossibleConnections,
} from "../controllers/station";

router.post("/station/create", create);
router.get("/station/getall", getall);
router.get("/station/getconnections", getPossibleConnections);
router.get("/station/get/:id?", getOneById);
router.patch("/station/update/:id?", update);
router.delete("/station/remove/:id?", remove);

module.exports = router;
