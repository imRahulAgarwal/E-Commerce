import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().trim().required().label("Product Name"),
    description: Joi.string().trim().optional().label("Description"),
    price: Joi.number().positive().required().label("Price"),
    isActive: Joi.boolean().optional().label("Active Status"),
}).options({ stripUnknown: true });
