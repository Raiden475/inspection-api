const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FormTemplate = sequelize.define('FormTemplate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  // Número de revisión - se incrementa en cada nueva versión
  revision: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  // Si hay una revisión más nueva, este pasa a obsoleto
  status: {
    type: DataTypes.ENUM('active', 'obsolete'),
    allowNull: false,
    defaultValue: 'active',
  },
  // Para linkear versiones del mismo formulario
  templateGroupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Agrupa todas las revisiones de un mismo formulario',
  },
}, {
  tableName: 'form_templates',
  timestamps: true,
});

module.exports = FormTemplate;
