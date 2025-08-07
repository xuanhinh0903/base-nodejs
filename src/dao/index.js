import logger from '../config/logger.js';

class Dao {
  constructor(model) {
    this.Model = model;
  }

  async findAll() {
    return this.Model.findAll()
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async findById(id) {
    return this.Model.findOne({ where: { id } })
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async findOneByWhere(where, attributes = null, order = ['id', 'desc']) {
    if (attributes == null) {
      return this.Model.findOne({
        where,
        order: [order],
      })
        .then(result => {
          return result;
        })
        .catch(e => {
          logger.error(e);
        });
    }
    return this.Model.findOne({
      where,
      attributes,
      order: [order],
    })
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async updateWhere(data, where) {
    return this.Model.update(data, { where })
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async updateById(data, id) {
    return this.Model.update(data, { where: { id } })
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async create(data) {
    try {
      const newData = new this.Model(data);
      return newData
        .save()
        .then(result => {
          return result;
        })
        .catch(e => {
          logger.error(e);
        });
    } catch (e) {
      logger.error(e);
    }
  }

  async findByWhere(
    where,
    attributes = undefined,
    order = ['id', 'asc'],
    limit = null,
    offset = null,
  ) {
    if (!attributes) {
      return this.Model.findAll({
        where,
        order: [order],
        limit,
        offset,
      });
    }

    return this.Model.findAll({
      where,
      attributes,
      order: [order],
      limit,
      offset,
    });
  }

  async deleteByWhere(where) {
    return this.Model.destroy({ where });
  }

  async bulkCreate(data) {
    return this.Model.bulkCreate(data)
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async getCountByWhere(where) {
    return this.Model.count({ where })
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
      });
  }

  async incrementCountInFieldByWhere(fieldName, where, incrementValue = 1) {
    const instance = await this.Model.findOne({ where });
    if (!instance) {
      return false;
    }

    return await instance.increment(fieldName, { by: incrementValue });
  }

  async decrementCountInFieldByWhere(fieldName, where, decrementValue = 1) {
    const instance = await this.Model.findOne({ where });
    if (!instance) {
      return false;
    }

    return await instance.decrement(fieldName, { by: decrementValue });
  }

  async updateOrCreate(values, condition) {
    return this.Model.findOne({ where: condition }).then(obj => {
      // update
      if (obj) {
        return obj.update(values);
      }
      // insert
      return this.Model.create(values);
    });
  }

  async checkExist(condition) {
    return this.Model.count({ where: condition }).then(count => {
      if (count !== 0) {
        return true;
      }
      return false;
    });
  }

  async getDataTableData(where, limit, offset, order = [['id', 'DESC']]) {
    return this.Model.findAndCountAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      where,
      order,
    })
      .then(result => {
        return result;
      })
      .catch(e => {
        logger.error(e);
        console.log(e);
        return [];
      });
  }
}
export default Dao;
