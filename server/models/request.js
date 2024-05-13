module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    "request",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      price: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: false,
    }
  );
  return Request;
};
