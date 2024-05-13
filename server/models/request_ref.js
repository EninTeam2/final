module.exports = (sequelize, DataTypes) => {
  const Request_ref = sequelize.define(
    "request_ref",
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
      comment: {
        type: DataTypes.TEXT,
      },
    },
    {
      timestamps: false,
    }
  );
  return Request_ref;
};
