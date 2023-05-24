const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} = require("../controllers/products.controllers");
const { productExist } = require("../helpers/porduct-validator");
const { categoryExist } = require("../helpers/category-validators");

const router = Router();

router.get("/", [], getProducts);

router.get(
  "/:id",
  [check("id").isMongoId(), check("id").custom(productExist), validateFields],
  getProductById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    check("category", "It's not a valid MongoId").isMongoId(),
    check("category", "The category is required").not().isEmpty(),
    check("category").custom(categoryExist),
    validateFields,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "It's not a valid MongoId").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  updateProductById
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "It's not a valid MongoId").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  deleteProductById
);

module.exports = router;
