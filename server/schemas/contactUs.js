import Joi from "joi";
import numberPattern from "../constants/number.js";

const contactUsSchema = Joi.object({
    name: Joi.string().trim().required().label("Name"),
    email: Joi.string().email().trim().lowercase().required().label("Email"),
    number: Joi.string().regex(numberPattern).required().label("Phone number"),
    message: Joi.string().trim().required().label("Message"),
}).options({ stripUnknown: true });

export default contactUsSchema;
