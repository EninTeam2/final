module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    "item",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
      },
    },
    {
      timestamps: false,
    }
  );
  return Item;
};
