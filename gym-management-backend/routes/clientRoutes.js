const express = require("express");
const {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const router = express.Router();
router.post("/", createClient);
router.get("/", getClients);
router.put("/:clientId", updateClient);
router.delete("/:clientId", deleteClient);

module.exports = router;
