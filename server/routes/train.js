import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
} from "../controllers/train";

router.post("/train/create", create);
router.get("/train/getall", getall);
router.get("/train/get/:id?", getOneById);
router.patch("/train/update/:id?", update);
router.delete("/train/remove/:id?", remove);

module.exports = router;
