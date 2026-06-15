const { InspectionReport, Answer, FormTemplate, Category, Question, Company, sequelize } = require('../models');

/**
 * POST /api/inspection-reports
 * Carga un formulario realizado con las respuestas.
 * Acepta multipart/form-data para las imágenes.
 *
 * Body (form-data o JSON si no hay imágenes):
 * {
 *   "formTemplateId": 1,
 *   "companyId": 3,
 *   "inspectionDate": "2024-03-15",
 *   "inspectorName": "Juan Pérez",
 *   "notes": "Observaciones generales",
 *   "answers": [
 *     { "questionId": 1, "value": "cumple", "observation": "" },
 *     { "questionId": 2, "value": "no_cumple", "observation": "Sin señalización" },
 *     { "questionId": 3, "value": "na" }
 *   ]
 * }
 * Las imágenes se envían como campos "image_<questionId>" en el multipart.
 */
const createInspectionReport = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { formTemplateId, companyId, inspectionDate, inspectorName, notes } = req.body;
    let answers = req.body.answers;

    // Si viene como string (multipart), parsearlo
    if (typeof answers === 'string') {
      try { answers = JSON.parse(answers); } catch {
        await t.rollback();
        return res.status(400).json({ error: 'El campo "answers" debe ser un JSON válido.' });
      }
    }

    if (!formTemplateId || !companyId) {
      await t.rollback();
      return res.status(400).json({ error: 'formTemplateId y companyId son requeridos.' });
    }

    // Validar que el formulario existe y está activo
    const form = await FormTemplate.findByPk(formTemplateId);
    if (!form) {
      await t.rollback();
      return res.status(404).json({ error: 'Formulario no encontrado.' });
    }
    if (form.status === 'obsolete') {
      await t.rollback();
      return res.status(400).json({
        error: `El formulario "${form.name}" Rev.${form.revision} está obsoleto. Use la versión activa.`,
      });
    }

    // Validar empresa
    const company = await Company.findByPk(companyId);
    if (!company) {
      await t.rollback();
      return res.status(404).json({ error: 'Empresa no encontrada.' });
    }

    // Crear el reporte
    const report = await InspectionReport.create(
      { formTemplateId, companyId, inspectionDate, inspectorName, notes, status: 'completed' },
      { transaction: t }
    );

    // Mapa de imágenes subidas: image_<questionId> -> path
    const uploadedFiles = req.files || {};
    const imageMap = {};
    for (const [fieldname, fileArray] of Object.entries(uploadedFiles)) {
      const match = fieldname.match(/^image_(\d+)$/);
      if (match) imageMap[match[1]] = fileArray[0].path;
    }

    // Crear respuestas
    for (const ans of answers || []) {
      const validValues = ['cumple', 'no_cumple', 'na'];
      if (!ans.questionId || !validValues.includes(ans.value)) {
        await t.rollback();
        return res.status(400).json({
          error: `Respuesta inválida para questionId ${ans.questionId}. Valores permitidos: cumple, no_cumple, na.`,
        });
      }

      await Answer.create(
        {
          inspectionReportId: report.id,
          questionId: ans.questionId,
          value: ans.value,
          observation: ans.observation || null,
          imagePath: imageMap[String(ans.questionId)] || null,
        },
        { transaction: t }
      );
    }

    await t.commit();

    // Devolver el reporte completo
    const fullReport = await _getFullReport(report.id);
    return res.status(201).json(fullReport);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error al crear el reporte.', detail: err.message });
  }
};

/**
 * GET /api/inspection-reports/:id
 * Devuelve un formulario realizado completo:
 * - Datos de la empresa
 * - Formulario (con revisión)
 * - Categorías y preguntas ordenadas
 * - Respuestas con imágenes
 */
const getInspectionReport = async (req, res) => {
  try {
    const report = await _getFullReport(req.params.id);
    if (!report) return res.status(404).json({ error: 'Reporte no encontrado.' });
    return res.json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el reporte.', detail: err.message });
  }
};

/**
 * GET /api/inspection-reports
 * Lista todos los reportes. Query params:
 * - ?companyId=N
 * - ?formTemplateId=N
 */
const listInspectionReports = async (req, res) => {
  try {
    const { companyId, formTemplateId } = req.query;
    const where = {};
    if (companyId) where.companyId = companyId;
    if (formTemplateId) where.formTemplateId = formTemplateId;

    const reports = await InspectionReport.findAll({
      where,
      include: [
        { model: Company, as: 'company', attributes: ['id', 'name', 'cuit'] },
        { model: FormTemplate, as: 'formTemplate', attributes: ['id', 'name', 'revision', 'status'] },
      ],
      order: [['inspectionDate', 'DESC'], ['createdAt', 'DESC']],
    });

    return res.json(reports);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar reportes.', detail: err.message });
  }
};

/**
 * Helper: obtiene el reporte completo con toda la jerarquía
 */
const _getFullReport = async (id) => {
  return InspectionReport.findByPk(id, {
    include: [
      {
        model: Company,
        as: 'company',
      },
      {
        model: FormTemplate,
        as: 'formTemplate',
        include: [{
          model: Category,
          as: 'categories',
          include: [{
            model: Question,
            as: 'questions',
            include: [{
              model: Answer,
              as: 'answers',
              where: { inspectionReportId: id },
              required: false, // left join: muestra preguntas aunque no tengan respuesta
            }],
          }],
        }],
      },
    ],
    order: [
      [{ model: FormTemplate, as: 'formTemplate' }, { model: Category, as: 'categories' }, 'order', 'ASC'],
      [{ model: FormTemplate, as: 'formTemplate' }, { model: Category, as: 'categories' },
       { model: Question, as: 'questions' }, 'order', 'ASC'],
    ],
  });
};

module.exports = { createInspectionReport, getInspectionReport, listInspectionReports };
