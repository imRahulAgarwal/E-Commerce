import Joi from "joi";

const roleSchema = Joi.object({
    name: Joi.string().trim().required().label("Role name"),
    description: Joi.string().optional().allow("").label("Role description"),
}).options({ stripUnknown: true });

export default roleSchema;
