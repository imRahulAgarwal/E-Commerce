import Joi from "joi";

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().trim().min(6).required().label("Old Password"),
    newPassword: Joi.string().trim().min(6).required().label("New Password"),
    confirmPassword: Joi.string().equal(Joi.ref("newPassword")).trim().required().label("Confirm Password").messages({
        "any.only": "Passwords are not same",
    }),
}).options({ stripUnknown: true });

export const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().trim().min(6).required().label("New Password"),
    confirmPassword: Joi.string().equal(Joi.ref("newPassword")).trim().required().label("Confirm Password").messages({
        "any.only": "Passwords are not same",
    }),
}).options({ stripUnknown: true });
