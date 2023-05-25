const validateFields = require("../middlewares/validate-fields");
const validateJWT = require("../middlewares/validate-jwt");
const validateRole = require("../middlewares/validate-role");
const validateFileToUpload = require("../middlewares/validate-file");

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRole,
  ...validateFileToUpload,
};
