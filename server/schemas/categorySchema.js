import Joi from "joi";

const categorySchema = Joi.object({
    name: Joi.string().trim().required().label("Category name"),
}).options({ stripUnknown: true });

export default categorySchema;
