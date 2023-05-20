const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");

const { login, googleLogin } = require("../controllers/auth.controllers");

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

module.exports = router;
