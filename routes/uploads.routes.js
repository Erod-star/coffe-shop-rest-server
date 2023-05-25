const { Router } = require("express");
const { check } = require("express-validator");

const {
  uploadFile,
  // updateImage,
  getImageById,
  updateImageCloudinary,
} = require("../controllers/uploads.controllers");

const { validateFields, validateFileToUpload } = require("../middlewares");
const { validateAllowedCollections } = require("../helpers/db-validators");

const router = Router();

router.post("/", validateFileToUpload, uploadFile);

router.put(
  "/:collection/:id",
  [
    validateFileToUpload,
    check("id", "It's not a valid MongoId").isMongoId(),
    check("collection").custom((collection) =>
      validateAllowedCollections(collection, ["users", "products"])
    ),
    validateFields,
  ],
  // updateImage
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "It's not a valid MongoId").isMongoId(),
    check("collection").custom((collection) =>
      validateAllowedCollections(collection, ["users", "products"])
    ),
    validateFields,
  ],
  getImageById
);

module.exports = router;
