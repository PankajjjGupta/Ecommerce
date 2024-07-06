const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Categories = require("../categories");

const productSchema = new Schema({
    name : String,
    price : String,
    stock : String,
    description : String,
    image : String,
    category : {
        type : String,
        enum : Categories
    }
})

module.exports = mongoose.model("Product", productSchema);