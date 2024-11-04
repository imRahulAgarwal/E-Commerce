import Joi from "joi";

const productColourSchema = Joi.object({
    colour: Joi.string().trim().required().label("Colour"),
}).options({ stripUnknown: true });

export default productColourSchema;
