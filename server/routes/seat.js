import express from "express";
const router = express.Router();

//controllers
import {
  create,
  getall,
  getOneById,
  update,
  remove,
  getSeatsTaken
} from "../controllers/seat";

router.post("/seat/create", create);
router.get("/seat/getall", getall);
router.get("/seat/gettaken", getSeatsTaken);
router.get("/seat/get/:id?", getOneById);
router.patch("/seat/update/:id?", update);
router.delete("/seat/remove/:id?", remove);

module.exports = router;
