const express = require("express");
const {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");

const router = express.Router();

router.post("/", createPackage);

router.get("/", getPackages);

router.put("/:packageId", updatePackage);

router.delete("/:packageId", deletePackage);

module.exports = router;
