const Joi = require("joi");
const Categories = require('./categories');

const productSchema = Joi.object({
    product : Joi.object({
        name : Joi.string().required(),
        price : Joi.number().required(),
        stock : Joi.number().required(),
        description : Joi.string().required(),
        image : Joi.string().required(),
        category : Joi.string().valid(...Categories).required()
    }).required()
});

module.exports.productSchema = productSchema;