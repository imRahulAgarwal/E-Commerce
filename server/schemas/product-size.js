import Joi from "joi";

// Joi schema for product size validation
const productSizeSchema = Joi.object({
    size: Joi.string().trim().required().label("Size"),
    description: Joi.string().required().label("Description"),
    quantity: Joi.number().positive().required().label("Quantity"),
    isActive: Joi.boolean().required().label("Is Active"),
}).options({ stripUnknown: true });

export default productSizeSchema;
