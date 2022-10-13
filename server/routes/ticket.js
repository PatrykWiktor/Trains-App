import express from "express";
const router = express.Router();

//controllers
import {
  validate,
  create,
  getall,
  getOneById,
  update,
  remove,
} from "../controllers/ticket";

router.post("/ticket/validate",validate)
router.post("/ticket/create", create);
router.get("/ticket/getall", getall);
router.get("/ticket/get/:id?", getOneById);
router.patch("/ticket/update/:id?", update);
router.delete("/ticket/remove/:id?", remove);

module.exports = router;
