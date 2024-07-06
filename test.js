const Product = require("./models/products");
const HomeProducts = require("./models/homeproducts");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")
.then(() => {
    console.log("Mongo Connection Open!");
})
.catch((e) => {
    console.log("Mongo Connection Error!");
    console.log(e);
})

async function a () {
    const updateMenu = await HomeProducts.findOneAndUpdate(
        { _id: '664090512a31f92e9456923e' },
        { $pull: { products: '6640909fce6a5b4596148d67' } },
        { new: true }
    )
    
}
  a();