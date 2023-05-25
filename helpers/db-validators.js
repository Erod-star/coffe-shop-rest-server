const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) {
    throw new Error(`The role ${role} is not on the database records`);
  }
};

const emailExist = async (email = "") => {
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new Error(`The email ${email} it's already in use`);
  }
};

const userIdExist = async (id = "") => {
  const userIdExist = await User.findById(id);
  if (!userIdExist) {
    throw new Error(`The id - ${id} does not exist`);
  }
};

const validateAllowedCollections = (collection = "", collections = []) => {
  const isIncluded = collections.includes(collection);
  if (!isIncluded) {
    throw new Error(`The collection ${collection} is not allowed`);
  }
  return true;
};

module.exports = {
  isValidRole,
  emailExist,
  userIdExist,
  validateAllowedCollections,
};
