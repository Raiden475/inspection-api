const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InspectionReport = sequelize.define('InspectionReport', {
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
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'companies', key: 'id' },
  },
  inspectionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Inspector o responsable
  inspectorName: {
    type: DataTypes.STRING(200),
  },
  notes: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('draft', 'completed'),
    defaultValue: 'completed',
  },
}, {
  tableName: 'inspection_reports',
  timestamps: true,
});

module.exports = InspectionReport;
