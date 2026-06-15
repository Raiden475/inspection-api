require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');

const formTemplateRoutes = require('./routes/formTemplateRoutes');
const inspectionReportRoutes = require('./routes/inspectionReportRoutes');
const companyRoutes = require('./routes/companyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes subidas de forma estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api/form-templates', formTemplateRoutes);
app.use('/api/inspection-reports', inspectionReportRoutes);
app.use('/api/companies', companyRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` }));

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno del servidor.' });
});

// Sincronizar DB y levantar servidor
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    // alter: true actualiza tablas existentes sin borrar datos
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log('\nEndpoints disponibles:');
      console.log('  GET    /api/companies');
      console.log('  POST   /api/companies');
      console.log('  GET    /api/form-templates');
      console.log('  GET    /api/form-templates/:id');
      console.log('  POST   /api/form-templates');
      console.log('  POST   /api/form-templates/:id/new-revision');
      console.log('  GET    /api/inspection-reports');
      console.log('  GET    /api/inspection-reports/:id');
      console.log('  POST   /api/inspection-reports');
    });
  } catch (err) {
    console.error('❌ Error al iniciar:', err.message);
    process.exit(1);
  }
};

start();
