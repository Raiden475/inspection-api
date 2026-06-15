const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  cuit: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  address: {
    type: DataTypes.STRING(300),
  },
}, {
  tableName: 'companies',
  timestamps: true,
});

module.exports = Company;
