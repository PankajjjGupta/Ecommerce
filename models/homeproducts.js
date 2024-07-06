const mongoose = require("mongoose");
const Product = require("./products");
const Schema = mongoose.Schema;

const homeSchema = new Schema({
    products : [{type : Schema.Types.ObjectId, ref : 'Product'}]
})

module.exports = mongoose.model("homeproduct", homeSchema);