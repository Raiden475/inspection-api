const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  formTemplateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'form_templates', key: 'id' },
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // Orden dentro del formulario (1, 2, 3...)
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category;
