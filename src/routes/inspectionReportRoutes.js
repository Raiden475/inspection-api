const router = require('express').Router();
const upload = require('../middlewares/upload');
const {
  createInspectionReport,
  getInspectionReport,
  listInspectionReports,
} = require('../controllers/inspectionReportController');

// Listar reportes (filtros: ?companyId=N&formTemplateId=N)
router.get('/', listInspectionReports);

// Ver un reporte completo (findOne con empresa, formulario, preguntas y respuestas)
router.get('/:id', getInspectionReport);

// Cargar un nuevo formulario realizado
// Acepta multipart/form-data para las imágenes adjuntas (campo: image_<questionId>)
// También acepta JSON si no hay imágenes
router.post('/', upload.fields([
  // Hasta 50 imágenes por formulario (una por pregunta)
  ...Array.from({ length: 50 }, (_, i) => ({ name: `image_${i + 1}`, maxCount: 1 })),
]), createInspectionReport);

module.exports = router;
