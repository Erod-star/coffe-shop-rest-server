const { Product } = require("../models");

const productExist = async (id = "") => {
  const product = await Product.findById(id);
  if (!product || !product.state) {
    throw new Error(`The product with the id - ${id} doesn't exist`);
  }
};

module.exports = {
  productExist,
};
