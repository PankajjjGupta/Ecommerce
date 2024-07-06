const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate")
const app = express();
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const bodyParser = require("body-parser")
const CarouselProduct = require("./models/carouselproducts");
const Product = require("./models/products");
const Categories = require("./categories");
const HomeProducts = require("./models/homeproducts");
const { homedir } = require("os");
const products = require("./models/products");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/AppError");
const {productSchema} = require("./schemas");
const Session = require("express-session");
const flash = require("connect-flash");


mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce")
.then(() => {
    console.log("Mongo Connection Open!");
})
.catch((e) => {
    console.log("Mongo Connection Error!");
    console.log(e);
})


app.use(bodyParser.urlencoded({extended : true}));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

const sessionOptions = {
    secret : 'thisismysecret',
    resave : true,
    saveUninitialized : false,
    cookie : {
        httpOnly : true,
        expires : Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24
    }
}

app.use(Session(sessionOptions));
app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    next();
})
app.use(express.static(path.join(__dirname, "/public")));


const validateProduct = (req, res, next) => {
    console.log(req.body)
    const {error} = productSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(",")
        next(new AppError(message, 404));
    }else {
        next()
    }
    
}

const findHelper = async (query) => {
    if(query == "allproducts" || query == "addhome") {
        const allProducts = await Product.find({});
        return allProducts;
    }
    return false;
}

const removeAllIdAndAddId = async (productsID) => {
    const HomeProduct = await HomeProducts.findOne({});
    // Emptying the products reference array!
    HomeProduct.products.map(async (e) => {
        await HomeProducts.updateOne( {_id : '664090512a31f92e9456923e'}, { $pop: { products : -1 } } )
    })
    // Pushing the products id's reference to the HomeProduct document
    productsID.map(async (productID) => {
        const product = await Product.findById(productID);
        const HomeProduct = await HomeProducts.findOne({});
        HomeProduct.products.push(product);
        await HomeProduct.save();
    }) 
};

const fetchProducts = async (category) => {
    if(category == "featured" || !category) {
        return await HomeProducts.findOne({}).populate("products");
    } else if (category == "mobilephones") {
        return await Product.find({category : {$in : ['Android', 'Iphone']} });
    } else {
        const capitalizeCategoryWord = (category.charAt(0).toUpperCase()
        + category.slice(1)); 
        return await Product.find({category :  capitalizeCategoryWord});
    }
}

app.get("/", catchAsync(async (req, res) => {
    const {category} = req.query;
    const CarouselProducts = await CarouselProduct.find({});
    const Products = await fetchProducts(category);
    res.render("index", {CarouselProducts, Products, Categories, navigator : false, category});
}))


app.get("/products/:id", catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product) { next(new AppError("Product not found!", 404))};
    res.render("show", {CarouselProducts : false, product, navigator : product.category});
}))


app.get("/admin-panel", async (req, res) => {
    const {query = ""} = req.query;
    const data = await findHelper(query);
    const HomeProduct = await HomeProducts.findById({_id : '664090512a31f92e9456923e'}).populate("products");
    res.render("admin/admin", {CarouselProducts : false, navigator : false, query, data, Categories, HomeProduct});
});

app.post("/add-products", validateProduct, catchAsync(async(req, res) => {
    const {name, price, stock, category, image, description} = req.body.product;
    const product = new Product({
        name,
        price,
        stock,
        category,
        image,
        description
    })
    await product.save()
    res.redirect(`/products/${product._id}`);
}))


app.delete("/products/:id", catchAsync(async(req, res) => {
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    req.flash("success", "Product is deleted successfully!")
    res.redirect("/admin-panel")
}))

app.post("/products/addhome", catchAsync(async (req, res) => {
    const productsObj = req.body;
    const productsID = Object.values(productsObj);
    await removeAllIdAndAddId(productsID);
    res.json({"success" : "true", "fail" : "false"})
}))

app.post("/add-carousel-products", catchAsync(async(req, res) => {
    const {title, image, description } = req.body.product;
    const carouselProduct = new CarouselProduct({title, image, description});
    // console.log(carouselProduct);
    await carouselProduct.save();
    res.redirect("/");
}))


// app.get("*", (req, res) => {
    
// })

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render("error", {CarouselProducts : false, navigator : false, err})
})

app.listen(3000, () => {
    console.log("SERVING ON PORT 3000!");
})