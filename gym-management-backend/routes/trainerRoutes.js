// src/routes/trainerRoutes.js
const express = require("express");
const {
  createTrainer,
  getTrainers,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainerController");

const router = express.Router();

router.post("/", createTrainer);

router.get("/", getTrainers);

router.put("/:trainerId", updateTrainer);


router.delete("/:trainerId", deleteTrainer);

module.exports = router;
