import Joi from "joi";

const addressSchema = Joi.object({
    addressLine1: Joi.string().required().trim().label("Address Line 1"),
    addressLine2: Joi.string().allow("").optional().label("Address Line 2"),
    city: Joi.string().required().trim().label("City"),
    state: Joi.string().required().trim().label("State"),
    country: Joi.string().required().trim().label("Country"),
    pincode: Joi.number().required().label("Pincode"),
}).options({ stripUnknown: true });

export default addressSchema;
