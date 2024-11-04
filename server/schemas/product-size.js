import Joi from "joi";

// Joi schema for product size validation
const productSizeSchema = Joi.object({
    size: Joi.string().trim().required().label("Size"),
    description: Joi.string().required().label("Description"),
}).options({ stripUnknown: true });

export default productSizeSchema;
