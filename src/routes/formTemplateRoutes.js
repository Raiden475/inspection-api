const router = require('express').Router();
const {
  createFormTemplate,
  createNewRevision,
  listFormTemplates,
  getFormTemplate,
} = require('../controllers/formTemplateController');

// Listar todos los formularios (con filtros opcionales por ?status=active|obsolete&groupId=N)
router.get('/', listFormTemplates);

// Obtener un formulario con sus categorías y preguntas
router.get('/:id', getFormTemplate);

// Crear nuevo formulario
router.post('/', createFormTemplate);

// Crear nueva revisión de un formulario existente
router.post('/:id/new-revision', createNewRevision);

module.exports = router;
