import Dao from './index.js';
import models from '../models/index.js';

const User = models.user;

class UserDao extends Dao {
  constructor() {
    super(User); // Call the constructor of the parent class (Dao)
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async isEmailExists(email) {
    return User.count({ where: { email } }).then(count => {
      return count !== 0;
    });
  }

  async createWithTransaction(user, transaction) {
    return User.create(user, { transaction });
  }
}

export default UserDao;
