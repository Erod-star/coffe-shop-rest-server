const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Category, Product, User } = require("../models");

const allowedCollections = ["categories", "products", "roles", "users"];

const isMongoId = (term) => {
  return ObjectId.isValid(term);
};

const searchUsers = async (term = "", res = "") => {
  if (isMongoId(term)) {
    const user = await User.findById(term);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const insensitiveTerm = new RegExp(term, "i");

  const [total, results] = await Promise.all([
    User.count({
      $or: [{ name: insensitiveTerm }, { email: insensitiveTerm }],
      $and: [{ state: true }],
    }),
    User.find({
      $or: [{ name: insensitiveTerm }, { email: insensitiveTerm }],
      $and: [{ state: true }],
    }),
  ]);

  return res.json({
    total,
    results,
  });
};

const searchCategories = async (term = "", res = "") => {
  if (isMongoId(term)) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const insensitiveTerm = new RegExp(term, "i");

  const [total, results] = await Promise.all([
    Category.count({ name: insensitiveTerm, state: true }),
    Category.find({ name: insensitiveTerm, state: true }),
  ]);

  return res.json({
    total,
    results,
  });
};

const searchProducts = async (term = "", res = "") => {
  if (isMongoId(term)) {
    const product = await Product.findById(term).populate("category", "name");
    return res.json({
      results: product ? [product] : [],
    });
  }

  const insensitiveTerm = new RegExp(term, "i");

  const [total, results] = await Promise.all([
    Product.count({ name: insensitiveTerm, state: true }),
    Product.find({ name: insensitiveTerm, state: true }).populate(
      "category",
      "name"
    ),
  ]);

  return res.json({
    total,
    results,
  });
};

const search = (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    res.status(400).json({
      error: `The allowed collections are ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    case "users":
      searchUsers(term, res);
      break;
    default:
      res.status(500).json({
        error: "This search is not done yet",
      });
  }
};

module.exports = { search };
