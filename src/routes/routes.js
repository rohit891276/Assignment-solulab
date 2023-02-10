const express = require('express');
const router = express.Router();


const { createCategory } = require('../controllers/categoryController.js');
const { createProduct, getProductWithCategory, deleteProduct, updateProduct, deleteProduct2 } = require('../controllers/productController.js');


// category
router.post("/registerCategory", createCategory);

// product
router.post("/registerProduct", createProduct);
router.get("/getProductWithCategory", getProductWithCategory);
router.put("/updateProduct/:product_id", updateProduct);
router.delete("/deleteProduct/:product_id", deleteProduct);  // Partially delete
router.delete("/deleteProduct2/:product_id", deleteProduct2);  // Permanently delete

module.exports = router;