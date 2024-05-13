module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define(
    "sales",
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
  return Sales;
};
