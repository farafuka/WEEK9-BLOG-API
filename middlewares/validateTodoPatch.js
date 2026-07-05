const Joi = require("joi");

const validateTodoPatch = (req, res, next) => {
  const schema = Joi.object({
    task: Joi.string().min(3).max(100),
    completed: Joi.boolean(),
  }).min(1); // At least one field must be provided

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }

  next();
}

module.exports = validateTodoPatch;