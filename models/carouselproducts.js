const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const carouselProductSchema = new Schema({
    title : String,
    image : String,
    description : String
})


module.exports = mongoose.model("CarouselProduct", carouselProductSchema);