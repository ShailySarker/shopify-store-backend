const Joi = require("joi");

const intervalSchema = Joi.object({
  interval: Joi.string()
    .valid("daily", "monthly", "quarterly", "yearly")
    .default("daily"),
});

module.exports = {
  intervalSchema,
};
