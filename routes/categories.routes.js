const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/categories.controller");

const { categoryExist } = require("../helpers/category-validators");

const router = Router();

router.get("/", [], getCategories);

router.get(
  "/:id",
  [
    check("id", "It's not a valid MongoId").isMongoId(),
    check("id").custom(categoryExist),
    validateFields,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    check("id").custom(categoryExist),
    validateFields,
  ],
  updateCategoryById
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "It's not a valid MongoId").isMongoId(),
    check("id").custom(categoryExist),
    validateFields,
  ],
  deleteCategoryById
);

module.exports = router;
