const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
    },
    qtyPerUnit: {
        type: Number
    },
    unitPrice: {
        type: Number
    },
    unitInStock: {
        type: Number
    },
    discontinued: {
        type: Boolean,
        default: false
    },
    categoryId: {
        type: ObjectId,
        ref: "Category"
    }
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);