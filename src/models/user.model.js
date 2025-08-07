import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      console.log('models', models);
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone_number: DataTypes.STRING, // Sửa từ 'phone' thành 'phone_number' để khớp với database
    },
    {
      sequelize,
      modelName: 'user',
      underscored: true,
      timestamps: true, // Bật timestamps
      createdAt: 'created_at', // Chỉ định tên column created_at
      updatedAt: false, // Tắt updated_at vì database không có column này
    },
  );
  return User;
};
