import Joi from "joi";

export const validateEmail = Joi.string().email().trim().lowercase().required().label("Email");
