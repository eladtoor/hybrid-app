const Product = require("../models/productModel");

// פונקציה ליצירת מוצר חדש
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// פונקציה לקבלת פרטי מוצר לפי מזהה
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// פונקציה לעדכון מוצר לפי מזהה
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// פונקציה למחיקת מוצר לפי מזהה
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
