module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "role",
    {
      Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );
  return Role;
};
