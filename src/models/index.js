const sequelize = require('../config/database');
const Company = require('./Company');
const FormTemplate = require('./FormTemplate');
const Category = require('./Category');
const Question = require('./Question');
const InspectionReport = require('./InspectionReport');
const Answer = require('./Answer');

// FormTemplate -> Categories -> Questions
FormTemplate.hasMany(Category, { foreignKey: 'formTemplateId', as: 'categories', onDelete: 'CASCADE' });
Category.belongsTo(FormTemplate, { foreignKey: 'formTemplateId', as: 'formTemplate' });

Category.hasMany(Question, { foreignKey: 'categoryId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// InspectionReport -> Company + FormTemplate
InspectionReport.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(InspectionReport, { foreignKey: 'companyId', as: 'inspectionReports' });

InspectionReport.belongsTo(FormTemplate, { foreignKey: 'formTemplateId', as: 'formTemplate' });
FormTemplate.hasMany(InspectionReport, { foreignKey: 'formTemplateId', as: 'inspectionReports' });

// InspectionReport -> Answers -> Questions
InspectionReport.hasMany(Answer, { foreignKey: 'inspectionReportId', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(InspectionReport, { foreignKey: 'inspectionReportId', as: 'inspectionReport' });

Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });

module.exports = { sequelize, Company, FormTemplate, Category, Question, InspectionReport, Answer };
