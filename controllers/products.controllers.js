const { request, response } = require("express");
const { Product } = require("../models");

const getProducts = async (req = request, res = response) => {
  const { limit = 5 } = req.query;
  const validState = { state: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(validState),
    Product.find(validState)
      .populate("user", "name")
      .populate("category", "name")
      .limit(limit),
  ]);

  return res.json({
    total,
    products,
  });
};

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

const createProduct = async (req = request, res = response) => {
  const { state, user, ...body } = req.body;

  const name = req.body.name.toUpperCase();

  const productDB = await Product.findOne({ name });

  if (productDB) {
    return res.status(400).json({
      msg: `The product ${name} already exist`,
    });
  }

  const data = {
    ...body,
    name,
    user: req.user._id,
  };

  const product = new Product(data);
  await product.save();
  return res.status(201).json(product);
};

const updateProductById = async (req = request, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.status(201).json(product);
};

const deleteProductById = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );
  res.json({ msg: "Deleted!", product });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
