const CategoryModel = require('../models/categoryModel')

const { isValid, isValidRequest, nameRegex } = require('../validator/validations.js');



// --------------------------------------------------------[Create the Category]------------------------------------------------------------------

const createCategory = async function (req, res) {
  try {
    const data = req.body;

    // Validation for requestBody
    if (!isValidRequest(data))
      return res.status(400).send({ status: true, message: "Please provide the data" });

    // Destructuring
    const { categoryId, categoryName } = data;

    // Validation for categoryId
    if (!isValid(categoryId))
      return res.status(400).send({ status: true, message: "Please provide CategoryId it cannot remain empty" });

    // making Db call to check the duplicate categoryId
    const findCategory = await CategoryModel.findOne({ categoryId: categoryId });
    if (findCategory)
      return res.status(400).send({ status: false, message: `This Category with the CategoryIdd: ${findCategory.categoryId} is already in use` });

    // Validation for categoryName
    if (!isValid(categoryName))
      return res.status(400).send({ status: true, message: "Please provide Category Name it cannot remain empty" });

    if (!nameRegex(categoryName))
      return res.status(400).send({ status: true, message: "Please provide valid Category Name it only contains alphabets /a-z/A-Z/ only" });

    // creating category
    const categoryCreated = await CategoryModel.create(data);
    return res.status(201).send({ status: true, data: categoryCreated });

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = { createCategory }

