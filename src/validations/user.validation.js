import Joi from 'joi';

class UserValidationSchema {

  constructor() {
    this.CreateUserSchema = {
      body: Joi.object().keys({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    };

    this.GetUsersSchema= {
      query: Joi.object().keys({
        page: Joi.number().default(1),
        pageSize: Joi.number().default(10),
        orderBy: Joi.valid('createdAt', 'name').default('createdAt'),
        sortBy: Joi.valid('DESC', 'ASC').default('DESC'),
      }),
    };

    this.GetUserByIdSchema = {
      params: Joi.object().keys({
        id: Joi.number().required(),
      }),
    };

    this.UpdateUserSchema = {
      params: Joi.object().keys({
        id: Joi.number().required(),
      }),
      body: Joi.object().keys({
        name: Joi.string().min(3).max(20),
        email: Joi.string().email(),
        password: Joi.string(),
      }).min(1),
    };

    this.DeleteUserSchema = {
      params: Joi.object().keys({
        id: Joi.number().required(),
      }),
    };
  }
}

export default new UserValidationSchema();