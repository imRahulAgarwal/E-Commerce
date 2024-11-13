import Joi from "joi";
import numberPattern from "../constants/number.js";

const panelUserSchema = Joi.object({
    fName: Joi.string().min(2).max(30).trim().required().label("First Name"),
    lName: Joi.string().min(2).max(30).trim().required().label("Last Name"),
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .trim()
        .label("Email"),
}).options({ stripUnknown: true });

export default panelUserSchema;
