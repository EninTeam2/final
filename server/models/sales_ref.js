module.exports = (sequelize, DataTypes) => {
  const Sales_ref = sequelize.define(
    "sales_ref",
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
      totalprice: {
        type: DataTypes.FLOAT,
      },
      remainprice: {
        type: DataTypes.FLOAT,
      },
      comment: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    }
  );
  return Sales_ref;
};
