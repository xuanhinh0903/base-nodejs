import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {
      console.log('models:', models);
      // Define associations here if needed
    }
  }

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('access', 'refresh'),
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Token',
      tableName: 'tokens',
      timestamps: true,
    },
  );

  return Token;
};
