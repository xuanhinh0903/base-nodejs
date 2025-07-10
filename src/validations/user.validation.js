import * as yup from 'yup';

const baseUserSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .lowercase()
    .trim(),
});

// Schema for creating a new user
export const createUserSchema = baseUserSchema.shape({
  name: baseUserSchema.fields.name.test(
    'unique-name',
    'User name already exists',
    async function (_value) {
      return true;
    },
  ),

  email: baseUserSchema.fields.email.test(
    'unique-email',
    'Email already exists',
    async function (_value) {
      return true;
    },
  ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .trim(),
});

// Schema for updating a user
export const updateUserSchema = baseUserSchema
  .shape({
    name: baseUserSchema.fields.name.optional(),
    email: baseUserSchema.fields.email.optional(),
  })
  .test(
    'at-least-one-field',
    'At least one field must be provided for update',
    function (value) {
      return value.name || value.email;
    },
  );

// Schema for user ID validation
export const userIdSchema = yup.object({
  id: yup
    .number()
    .required('User ID is required')
    .positive('ID must be a positive number')
    .integer('ID must be an integer'),
});

// Schema for pagination and search
export const userListSchema = yup.object({
  page: yup
    .number()
    .positive('Page must be a positive number')
    .integer('Page must be an integer')
    .default(1),

  limit: yup
    .number()
    .positive('Limit must be a positive number')
    .integer('Limit must be an integer')
    .min(1, 'Minimum limit is 1')
    .max(100, 'Maximum limit is 100')
    .default(10),

  search: yup
    .string()
    .max(100, 'Search keyword must not exceed 100 characters')
    .trim()
    .optional(),
});

// Schema for partial user data (used in filters)
export const userFilterSchema = yup.object({
  name: yup
    .string()
    .max(100, 'Name must not exceed 100 characters')
    .trim()
    .optional(),

  email: yup
    .string()
    .email('Invalid email address')
    .max(255, 'Email must not exceed 255 characters')
    .lowercase()
    .trim()
    .optional(),
});

// Schema for user login
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .lowercase()
    .trim(),

  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password cannot be empty'),
});

// Validation helper functions
export const validateUser = {
  // Validate user creation data
  create: async data => {
    try {
      const validatedData = await createUserSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
      return { isValid: true, data: validatedData, errors: null };
    } catch (error) {
      return {
        isValid: false,
        data: null,
        errors: error.errors,
      };
    }
  },

  // Validate user update data
  update: async data => {
    try {
      const validatedData = await updateUserSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
      return { isValid: true, data: validatedData, errors: null };
    } catch (error) {
      return {
        isValid: false,
        data: null,
        errors: error.errors,
      };
    }
  },

  // Validate user ID
  id: async id => {
    try {
      const validatedData = await userIdSchema.validate(
        { id },
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );
      return { isValid: true, data: validatedData, errors: null };
    } catch (error) {
      return {
        isValid: false,
        data: null,
        errors: error.errors,
      };
    }
  },

  // Validate list parameters
  list: async params => {
    try {
      const validatedData = await userListSchema.validate(params, {
        abortEarly: false,
        stripUnknown: true,
      });
      return { isValid: true, data: validatedData, errors: null };
    } catch (error) {
      return {
        isValid: false,
        data: null,
        errors: error.errors,
      };
    }
  },

  // Validate filter parameters
  // filter: async params => {
  //   try {
  //     const validatedData = await userFilterSchema.validate(params, {
  //       abortEarly: false,
  //       stripUnknown: true,
  //     });
  //     return { isValid: true, data: validatedData, errors: null };
  //   } catch (error) {
  //     return {
  //       isValid: false,
  //       data: null,
  //       errors: error.errors,
  //     };
  //   }
  // },

  // Validate login data
  login: async data => {
    try {
      const validatedData = await loginSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
      return { isValid: true, data: validatedData, errors: null };
    } catch (error) {
      return {
        isValid: false,
        data: null,
        errors: error.errors,
      };
    }
  },
};

export default validateUser;
