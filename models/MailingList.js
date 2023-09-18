module.exports = (sequelize, DataTypes) => {
  const MailingList = sequelize.define("MailingList", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return MailingList;
};
