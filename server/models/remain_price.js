module.exports = (sequelize, DataTypes) => {
  const Remain_price = sequelize.define(
    "remain_price",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
      },
      remainprice: {
        type: DataTypes.FLOAT,
      },
      paidprice: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    }
  );
  return Remain_price;
};
