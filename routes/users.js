const express = require("express");

const router = express.Router();

const AuthController = require("../controllers/auth");
const { upload } = require("../middlewares");

const { validateBody, authenticate } = require("../middlewares");
const { schemas } = require("../models/user");

router.post(
 "/register",
 validateBody(schemas.registerSchema),
 AuthController.register
);

router.post("/login", validateBody(schemas.loginSchema), AuthController.login);

router.get("/current", authenticate, AuthController.getCurrent);

router.post("/logout", authenticate, AuthController.logout);

router.patch(
 "/",
 authenticate,
 validateBody(schemas.updateSubscriptionSchema),
 AuthController.updateSubscription
);

router.patch(
 "/avatars",
 authenticate,
 upload.single("avatar"),
 AuthController.updateAvatar
);

router.get("/avatars", authenticate, AuthController.getAvatar);

module.exports = router;
