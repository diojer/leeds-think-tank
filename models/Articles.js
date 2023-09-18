module.exports = (sequelize, DataTypes) => {
  const Articles = sequelize.define("Articles", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bannerImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Articles;
};
