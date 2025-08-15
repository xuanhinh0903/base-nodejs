import Dao from './index.js';
import models from '../models/index.js';

const Token = models.Token;

class TokenDao extends Dao {
  constructor() {
    super(Token);
  }

  async findOne(where) {
    return Token.findOne({ where });
  }

  async remove(where) {
    return Token.destroy({ where });
  }
}

export default TokenDao;
