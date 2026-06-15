const { FormTemplate, Category, Question, sequelize } = require('../models');

/**
 * POST /api/form-templates
 * Crea un formulario nuevo con sus categorías y preguntas.
 * Body esperado:
 * {
 *   "name": "Formulario de Seguridad",
 *   "categories": [
 *     {
 *       "title": "Categoría 1",
 *       "order": 1,
 *       "questions": [
 *         { "text": "¿Tiene matafuegos?", "order": 1 },
 *         { "text": "¿Están vigentes?", "order": 2 }
 *       ]
 *     }
 *   ]
 * }
 */
const createFormTemplate = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, categories = [] } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre del formulario es requerido.' });
    }
    if (!categories.length) {
      return res.status(400).json({ error: 'El formulario debe tener al menos una categoría.' });
    }

    // Al crear un formulario nuevo (no una revisión), arranca en revisión 1
    // El templateGroupId se setea al id del propio formulario creado
    const form = await FormTemplate.create({ name, revision: 1, status: 'active' }, { transaction: t });

    // Seteamos el templateGroupId al mismo id del formulario (agrupa sus revisiones)
    await form.update({ templateGroupId: form.id }, { transaction: t });

    // Crear categorías y preguntas en orden
    for (const catData of categories) {
      if (!catData.title) {
        await t.rollback();
        return res.status(400).json({ error: 'Cada categoría debe tener un título.' });
      }
      const category = await Category.create(
        { formTemplateId: form.id, title: catData.title, order: catData.order || 1 },
        { transaction: t }
      );

      const questions = catData.questions || [];
      for (const qData of questions) {
        if (!qData.text) {
          await t.rollback();
          return res.status(400).json({ error: 'Cada pregunta debe tener texto.' });
        }
        await Question.create(
          { categoryId: category.id, text: qData.text, order: qData.order || 1 },
          { transaction: t }
        );
      }
    }

    await t.commit();

    // Devolvemos el formulario completo
    const fullForm = await FormTemplate.findByPk(form.id, {
      include: [{
        model: Category, as: 'categories',
        include: [{ model: Question, as: 'questions', order: [['order', 'ASC']] }],
        order: [['order', 'ASC']],
      }],
      order: [[{ model: Category, as: 'categories' }, 'order', 'ASC'],
              [{ model: Category, as: 'categories' }, { model: Question, as: 'questions' }, 'order', 'ASC']],
    });

    return res.status(201).json(fullForm);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error al crear el formulario.', detail: err.message });
  }
};

/**
 * POST /api/form-templates/:id/new-revision
 * Crea una nueva revisión de un formulario existente.
 * Marca el formulario anterior como 'obsolete'.
 * Acepta el mismo body que createFormTemplate (las nuevas categorías/preguntas).
 */
const createNewRevision = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, categories = [] } = req.body;

    const previousForm = await FormTemplate.findByPk(id);
    if (!previousForm) {
      return res.status(404).json({ error: 'Formulario no encontrado.' });
    }
    if (previousForm.status === 'obsolete') {
      return res.status(400).json({
        error: 'No se puede crear una revisión desde un formulario obsoleto. Use el formulario activo del mismo grupo.',
      });
    }

    if (!categories.length) {
      return res.status(400).json({ error: 'La nueva revisión debe tener al menos una categoría.' });
    }

    // Marcar el anterior como obsoleto
    await previousForm.update({ status: 'obsolete' }, { transaction: t });

    // Crear nueva revisión
    const newForm = await FormTemplate.create(
      {
        name: name || previousForm.name,
        revision: previousForm.revision + 1,
        status: 'active',
        templateGroupId: previousForm.templateGroupId,
      },
      { transaction: t }
    );

    // Crear las nuevas categorías y preguntas
    for (const catData of categories) {
      if (!catData.title) {
        await t.rollback();
        return res.status(400).json({ error: 'Cada categoría debe tener un título.' });
      }
      const category = await Category.create(
        { formTemplateId: newForm.id, title: catData.title, order: catData.order || 1 },
        { transaction: t }
      );
      for (const qData of catData.questions || []) {
        if (!qData.text) {
          await t.rollback();
          return res.status(400).json({ error: 'Cada pregunta debe tener texto.' });
        }
        await Question.create(
          { categoryId: category.id, text: qData.text, order: qData.order || 1 },
          { transaction: t }
        );
      }
    }

    await t.commit();

    const fullForm = await FormTemplate.findByPk(newForm.id, {
      include: [{
        model: Category, as: 'categories',
        include: [{ model: Question, as: 'questions' }],
      }],
      order: [[{ model: Category, as: 'categories' }, 'order', 'ASC'],
              [{ model: Category, as: 'categories' }, { model: Question, as: 'questions' }, 'order', 'ASC']],
    });

    return res.status(201).json({
      message: `Nueva revisión creada. La revisión ${previousForm.revision} fue marcada como obsoleta.`,
      formTemplate: fullForm,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error al crear la nueva revisión.', detail: err.message });
  }
};

/**
 * GET /api/form-templates
 * Lista todos los formularios. Query params:
 * - ?status=active|obsolete (default: todos)
 * - ?groupId=N (filtra por grupo de revisiones)
 */
const listFormTemplates = async (req, res) => {
  try {
    const { status, groupId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (groupId) where.templateGroupId = groupId;

    const forms = await FormTemplate.findAll({
      where,
      include: [{
        model: Category, as: 'categories',
        include: [{ model: Question, as: 'questions' }],
      }],
      order: [
        ['revision', 'DESC'],
        [{ model: Category, as: 'categories' }, 'order', 'ASC'],
        [{ model: Category, as: 'categories' }, { model: Question, as: 'questions' }, 'order', 'ASC'],
      ],
    });

    return res.json(forms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar formularios.', detail: err.message });
  }
};

/**
 * GET /api/form-templates/:id
 * Obtiene un formulario con todas sus categorías y preguntas.
 */
const getFormTemplate = async (req, res) => {
  try {
    const form = await FormTemplate.findByPk(req.params.id, {
      include: [{
        model: Category, as: 'categories',
        include: [{ model: Question, as: 'questions' }],
      }],
      order: [
        [{ model: Category, as: 'categories' }, 'order', 'ASC'],
        [{ model: Category, as: 'categories' }, { model: Question, as: 'questions' }, 'order', 'ASC'],
      ],
    });

    if (!form) return res.status(404).json({ error: 'Formulario no encontrado.' });
    return res.json(form);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el formulario.', detail: err.message });
  }
};

module.exports = { createFormTemplate, createNewRevision, listFormTemplates, getFormTemplate };
