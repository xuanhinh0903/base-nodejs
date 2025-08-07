import * as yup from 'yup';

export const userSchema = yup.object().shape({
  first_name: yup.string().required('first_name is a required field'),
  last_name: yup.string().required('last_name is a required field'),
  email: yup.string().email().required('email is a required field'),
  password: yup.string().required('password is a required field'),
  phone_number: yup.string().required('phone_number is a required field'),
});

export const userValidate = async (req, res, next) => {
  try {
    await userSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};
