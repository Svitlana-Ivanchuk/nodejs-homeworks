const express = require("express");

const router = express.Router();

const AuthController = require("../../controllers/auth");

const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  AuthController.register
);

router.post("/login", validateBody(schemas.loginSchema), AuthController.login);

module.exports = router;
