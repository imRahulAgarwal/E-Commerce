import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .trim()
        .label("Email"),
    password: Joi.string().min(6).trim().required().label("Password"),
}).options({ stripUnknown: true });

export default loginSchema;
