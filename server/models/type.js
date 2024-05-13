module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define(
    "type",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      typeName: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  return Type;
};
