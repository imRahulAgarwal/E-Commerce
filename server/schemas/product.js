// validation/product.js
import Joi from "joi";

export const productSchema = {
    create: Joi.object({
        name: Joi.string().trim().required().label("Product Name"),
        description: Joi.string().trim().optional().label("Description"),
        price: Joi.number().positive().required().label("Price"),
        isActive: Joi.boolean().optional().label("Active Status"),
    }),
    update: Joi.object({
        name: Joi.string().trim().optional().label("Product Name"),
        description: Joi.string().trim().optional().label("Description"),
        price: Joi.number().positive().optional().label("Price"),
        isActive: Joi.boolean().optional().label("Active Status"),
    }),
};
