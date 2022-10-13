import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
} from "../controllers/car";

router.post("/car/create", create);
router.get("/car/getall", getall);
router.get("/car/get/:id?", getOneById);
router.patch("/car/update/:id?", update);
router.delete("/car/remove/:id?", remove);

module.exports = router;
