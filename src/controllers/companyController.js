const { Company } = require('../models');

const createCompany = async (req, res) => {
  try {
    const { name, cuit, address } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre de la empresa es requerido.' });
    const company = await Company.create({ name, cuit, address });
    return res.status(201).json(company);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Ya existe una empresa con ese CUIT.' });
    }
    return res.status(500).json({ error: 'Error al crear la empresa.', detail: err.message });
  }
};

const listCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [['name', 'ASC']] });
    return res.json(companies);
  } catch (err) {
    return res.status(500).json({ error: 'Error al listar empresas.', detail: err.message });
  }
};

module.exports = { createCompany, listCompanies };
