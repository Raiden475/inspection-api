const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Answer = sequelize.define('Answer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  inspectionReportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'inspection_reports', key: 'id' },
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'questions', key: 'id' },
  },
  value: {
    type: DataTypes.ENUM('cumple', 'no_cumple', 'na'),
    allowNull: false,
  },
  // Ruta de la imagen adjunta (máx. 1 por pregunta)
  imagePath: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  observation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'answers',
  timestamps: true,
});

module.exports = Answer;
