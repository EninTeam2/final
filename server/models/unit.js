module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define(
    "unit",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      unitName: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  return Unit;
};
