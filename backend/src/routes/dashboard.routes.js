const express = require("express");
const controller = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, controller.overview);

module.exports = router;
