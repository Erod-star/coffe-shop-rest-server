const { Category } = require("../models");

const categoryExist = async (id = "") => {
  const category = await Category.findById(id);
  if (!category || !category.state) {
    throw new Error(`The category with the id - ${id} doesn't exist`);
  }
};

module.exports = {
  categoryExist,
};
