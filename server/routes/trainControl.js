import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
} from "../controllers/trainControl";

router.post("/traincontrol/create", create);
router.get("/traincontrol/getall", getall);
router.get("/traincontrol/get/:id?", getOneById);
router.patch("/traincontrol/update/:id?", update);
router.delete("/traincontrol/remove/:id?", remove);

module.exports = router;
