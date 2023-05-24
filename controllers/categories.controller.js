const { request, response } = require("express");
const { Category } = require("../models");

const getCategories = async (req = request, res = response) => {
  try {
    const { limit = 5 } = req.query;
    const validState = { state: true };

    const [total, categories] = await Promise.all([
      Category.countDocuments(validState),
      Category.find(validState).populate("user", "name").limit(Number(limit)),
    ]);

    return res.json({
      total,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      error: "There was an error retriving the categories",
    });
  }
};

const getCategoryById = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate("user", "name");

    if (!category.state) {
      return res;
    }

    return res.json({
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: `There was an error retriving the category with the provided id`,
    });
  }
};

const createCategory = async (req = request, res = response) => {
  try {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if (categoryDB) {
      return res.status(400).json({
        msg: `The category ${name} already exist`,
      });
    }

    const data = { name, user: req.user._id };

    const category = new Category(data);

    await category.save();

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: "Error creating category" });
  }
};

const updateCategoryById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `There was an error updating the category with the provided id`,
    });
  }
};

const deleteCategoryById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    res.json(category);
  } catch (error) {
    console.error("::error");
    res.status(500).json({
      error: `There was an error deleting the category with the provided id`,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
