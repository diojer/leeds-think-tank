module.exports = (sequelize, DataTypes) => {
  const Sponsors = sequelize.define("Sponsors", {
    forename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Sponsors;
};
