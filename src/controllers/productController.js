const ProductModel = require('../models/productModel.js')

const { isValidObjectId, isValid, isValidRequest } = require('../validator/validations.js');


// --------------------------------------------------------[Create the Products]------------------------------------------------------------------

const createProduct = async function (req, res) {
  try {
    const data = req.body;

    // Validation for requestBody
    if (!isValidRequest(data))
      return res.status(400).send({ status: true, message: "Please provide the data" });

    // Destructuring
    const { productId, productName, qtyPerUnit, unitPrice, unitInStock, categoryId } = data;


    // Validation for productId
    if (!isValid(productId))
      return res.status(400).send({ status: true, message: "Please provide ProductId it cannot remain empty" });

    // making Db call to check the duplicate productId
    const findProduct = await ProductModel.findOne({ productId: productId });
    if (findProduct)
      return res.status(400).send({ status: false, message: `This Product with the ProductIdd: ${findProduct.productId} is already in use` });

    // Validation for productName
    if (!isValid(productName))
      return res.status(400).send({ status: true, message: "Please provide Product Name it cannot remain empty" });

    // Validation for qtyPerUnit
    if (!isValid(qtyPerUnit))
      return res.status(400).send({ status: true, message: "Please provide Quantity of the Product it cannot remain empty" });

    // Validation for unitPrice
    if (!isValid(unitPrice))
      return res.status(400).send({ status: true, message: "Please provide Unit Price of the Product it cannot remain empty" });

    // Validation for unitInStock
    if (!isValid(unitInStock))
      return res.status(400).send({ status: true, message: "Please provide Unit In Stock it cannot remain empty" });

    // Validation for categoryId
    if (categoryId) {
      if (!isValid(categoryId))
        return res.status(400).send({ status: true, message: "Please provide CategoryId it cannot remain empty" });

      if (!isValidObjectId(categoryId))
        return res.status(400).send({ status: false, message: `${categoryId} is not valid CategoryId` });
    }

    // Creating Data
    const productCreated = await ProductModel.create(data);
    return res.status(201).send({ status: true, data: productCreated })

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}


// --------------------------------------------------------[Get the Products]------------------------------------------------------------------

const getProductWithCategory = async function (req, res) {
  try {
    const { productName, productId } = req.query;
    console.log(req.query)
    const filter = { discontinued: false }

    if (Object.keys(req.query).length !== 0) {
      filter['$or'] = [
        { productId: productId },
        { productName: productName }
      ];

      // validation for productId
      if (productId) {
        if (!isValid(productId))
          return res.status(400).send({ status: false, message: "ProductId is required" });
      }

      // find product details with filters
      const findData = await ProductModel.find(filter).populate({ path: 'categoryId', select: { 'categoryId': 1, 'categoryName': 1, '_id': 0 } });

      if (findData.length === 0) {
        return res.status(404).send({ status: false, message: "No Product data found" })
      }
      return res.status(200).send({ status: true, data: findData })

    } else {
      // find product details without filters
      const findData = await ProductModel.find(filter).populate({ path: 'categoryId', select: { 'categoryId': 1, 'categoryName': 1, '_id': 0 } });
      if (findData.length === 0) {
        return res.status(404).send({ status: false, message: "No Product data found" })
      }

      return res.status(200).send({ status: true, data: findData })
    }

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}


// --------------------------------------------------------[Update the Products]------------------------------------------------------------------

const updateProduct = async function (req, res) {
  try {
    const data = req.body;
    const paramsId = req.params.product_id;

    // Destructuring
    const { productId, productName, qtyPerUnit, unitPrice, unitInStock, categoryId } = data;

    // making Db call to find the products
    const findProduct = await ProductModel.findOne({ _id: paramsId });
    if (!findProduct)
      return res.status(404).send({ status: false, message: `No Product with the Product_id: ${paramsId} is found` });

    // Validation for productId
    if (productId) {
      if (!isValid(productId))
        return res.status(400).send({ status: true, message: "Please provide ProductId it cannot remain empty" });
      if (productId === findProduct.productId)
        return res.status(400).send({ status: true, message: "The productId you are trying to update is already the same so provide different Id" });
    }

    // Validation for productName
    if (productName) {
      if (!isValid(productName))
        return res.status(400).send({ status: true, message: "Please provide Product Name it cannot remain empty" });
    }

    // Validation for qtyPerUnit
    if (qtyPerUnit) {
      if (!isValid(qtyPerUnit))
        return res.status(400).send({ status: true, message: "Please provide Quantity of the Product it cannot remain empty" });
    }

    // Validation for unitPrice
    if (unitPrice) {
      if (!isValid(unitPrice))
        return res.status(400).send({ status: true, message: "Please provide Unit Price of the Product it cannot remain empty" });
    }

    // Validation for unitInStock
    if (unitInStock) {
      if (!isValid(unitInStock))
        return res.status(400).send({ status: true, message: "Please provide Unit In Stock it cannot remain empty" });
    }

    // Validation for categoryId
    if (categoryId) {
      if (!isValid(categoryId))
        return res.status(400).send({ status: true, message: "Please provide CategoryId it cannot remain empty" });

      if (!isValidObjectId(categoryId))
        return res.status(400).send({ status: false, message: `${categoryId} is not valid CategoryId` });
    }

    // Now update the product--
    const updateData = await ProductModel.findOneAndUpdate({ _id: paramsId }, data)
    return res.status(200).send({ status: true, message: "Your Resource are now Updated" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}


// --------------------------------------------------------[Delete the Products]------------------------------------------------------------------

// Method 1  Partially delete the data
const deleteProduct = async function (req, res) {
  try {
    const paramsId = req.params.product_id;

    const filter = { _id: paramsId, discontinued: false };

    // Checking the product is present or not 
    const findProduct = await ProductModel.findOne(filter)
    if (!findProduct)
      return res.status(404).send({ status: false, message: `This product with the productId: ${paramsId} is not found or deleted.` });

    findProduct.discontinued = true;

    const deleteData = await ProductModel.findByIdAndUpdate({ _id: paramsId }, findProduct, { new: true });
    res.status(200).send({ status: true, message: 'Success', message: "Product is successfully deleted", data: deleteData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}


// Method 2, This will permanently delete the product from the DB
const deleteProduct2 = async function (req, res) {
  try {
    const paramsId = req.params.product_id;

    const filter = { _id: paramsId, discontinued: false };

    // Checking the product is present or not 
    const findProduct = await ProductModel.findOne(filter);
    if (!findProduct)
      return res.status(404).send({ status: false, message: `This product with the productId: ${paramsId} is not found or deleted.` });

    const deleteData = await ProductModel.findByIdAndDelete({ _id: paramsId }, findProduct);
    res.status(200).send({ status: true, message: "Product is permanently deleted from DB" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}


module.exports = { createProduct, getProductWithCategory, updateProduct, deleteProduct, deleteProduct2 }