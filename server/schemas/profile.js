import Joi from "joi";

const profileSchema = Joi.object({
    fName: Joi.string().trim().required().label("First Name"),
    lName: Joi.string().trim().required().label("Last Name"),
    email: Joi.string().email().trim().lowercase().required().label("Email"),
    number: Joi.string().trim().required().label("Phone number"),
}).options({ stripUnknown: true });

export default profileSchema;
