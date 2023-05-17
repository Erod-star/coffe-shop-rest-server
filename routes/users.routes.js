const { Router } = require("express");
const { check } = require("express-validator");

const { validateFieldsMiddleware } = require("../middlewares/validate-fields");
const {
  isValidRole,
  emailExist,
  userIdExist,
} = require("../helpers/db-validators");

const {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} = require("../controllers/users.controllers");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("email", "The email is not valid").isEmail(),
    check("password", "The password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("name", "The name is required").not().isEmpty(),
    check("email").custom(emailExist),
    check("role").custom(isValidRole),
    validateFieldsMiddleware,
  ],
  postUsers
);

router.put(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdExist),
    check("role").custom(isValidRole),
    validateFieldsMiddleware,
  ],
  putUsers
);

router.patch("/:id", patchUsers);

router.delete(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(userIdExist),
    validateFieldsMiddleware,
  ],
  deleteUsers
);

module.exports = router;
