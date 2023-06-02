const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT } = require("../middlewares");

const {
  login,
  googleLogin,
  renewToken,
} = require("../controllers/auth.controllers");

const router = Router();

router.post(
  "/login",
  [
    check("email", "The email is mandatory").isEmail(),
    check("password", "The password is mandatory").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("id_token", "The id_token is mandatory").not().isEmpty(),
    validateFields,
  ],
  googleLogin
);

router.get("/", validateJWT, renewToken);

module.exports = router;
