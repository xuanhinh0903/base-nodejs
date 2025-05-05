/**
 * Middleware để xác thực request dựa trên schema Joi
 * @param {Object} schema - Schema Joi để validate
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const validSchema = Object.keys(schema).reduce((acc, key) => {
    if (req[key]) {
      acc[key] = schema[key];
    }
    return acc;
  }, {});

  if (Object.keys(validSchema).length === 0) {
    return next();
  }

  const { value, error } = Object.keys(validSchema).reduce(
    (result, key) => {
      const { error, value } = validSchema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true,
      });

      if (error) {
        result.error = result.error || {};
        result.error[key] = error.details.map((detail) => detail.message);
      }

      if (value) {
        result.value = result.value || {};
        result.value[key] = value;
      }

      return result;
    },
    { value: {}, error: null }
  );

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error,
    });
  }

  // Gán các giá trị đã validate vào request, ngoại trừ query
  if (value.body) req.body = value.body;
  if (value.params) req.params = value.params;
  // Không thể trực tiếp gán req.query, nên lưu vào một thuộc tính khác
  if (value.query) req.validatedQuery = value.query;
  
  return next();
};

export default validate; 