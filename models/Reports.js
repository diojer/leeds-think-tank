module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define("Reports", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Reports;
};
