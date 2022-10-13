import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
} from "../controllers/route";

router.post("/route/create", create);
router.get("/route/getall", getall);
router.get("/route/get/:id?", getOneById);
router.patch("/route/update/:id?", update);
router.delete("/route/remove/:id?", remove);


module.exports = router;
