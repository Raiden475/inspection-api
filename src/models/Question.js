const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'categories', key: 'id' },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Orden dentro de la categoría (1, 2, 3...)
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'questions',
  timestamps: true,
});

module.exports = Question;
