const router = require('express').Router();
const { createCompany, listCompanies } = require('../controllers/companyController');

router.get('/', listCompanies);
router.post('/', createCompany);

module.exports = router;
