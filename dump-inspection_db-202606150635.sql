-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: inspection_db
-- ------------------------------------------------------
-- Server version	11.5.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inspectionReportId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `value` enum('cumple','no_cumple','na') NOT NULL,
  `imagePath` varchar(500) DEFAULT NULL,
  `observation` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inspectionReportId` (`inspectionReportId`),
  KEY `questionId` (`questionId`),
  CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`inspectionReportId`) REFERENCES `inspection_reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `answers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,1,1,'cumple',NULL,NULL,'2026-06-15 01:19:30','2026-06-15 01:19:30'),(2,1,2,'no_cumple',NULL,'Sin puesta a tierra en sector B','2026-06-15 01:19:30','2026-06-15 01:19:30'),(3,1,3,'cumple',NULL,NULL,'2026-06-15 01:19:30','2026-06-15 01:19:30'),(4,1,4,'na',NULL,NULL,'2026-06-15 01:19:30','2026-06-15 01:19:30'),(5,2,12,'cumple',NULL,NULL,'2026-06-15 09:27:54','2026-06-15 09:27:54'),(6,2,13,'no_cumple',NULL,'No existe plan documentado','2026-06-15 09:27:54','2026-06-15 09:27:54'),(7,2,14,'cumple',NULL,NULL,'2026-06-15 09:27:54','2026-06-15 09:27:54'),(8,2,15,'cumple',NULL,NULL,'2026-06-15 09:27:54','2026-06-15 09:27:54'),(9,2,16,'no_cumple',NULL,'Permiso vencido en marzo','2026-06-15 09:27:54','2026-06-15 09:27:54'),(10,3,5,'cumple',NULL,NULL,'2026-06-15 09:28:24','2026-06-15 09:28:24'),(11,3,6,'cumple',NULL,NULL,'2026-06-15 09:28:24','2026-06-15 09:28:24'),(12,3,7,'no_cumple',NULL,'Cables sin identificar en sector C','2026-06-15 09:28:24','2026-06-15 09:28:24'),(13,3,8,'cumple',NULL,NULL,'2026-06-15 09:28:24','2026-06-15 09:28:24'),(14,3,9,'cumple',NULL,NULL,'2026-06-15 09:28:24','2026-06-15 09:28:24'),(15,3,10,'cumple',NULL,NULL,'2026-06-15 09:28:24','2026-06-15 09:28:24'),(16,3,11,'na',NULL,NULL,'2026-06-15 09:28:24','2026-06-15 09:28:24');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formTemplateId` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `formTemplateId` (`formTemplateId`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`formTemplateId`) REFERENCES `form_templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,'Instalaciones Eléctricas',1,'2026-06-15 00:33:51','2026-06-15 00:33:51'),(2,1,'Matafuegos',2,'2026-06-15 00:33:51','2026-06-15 00:33:51'),(3,2,'Instalaciones Eléctricas',1,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(4,2,'Matafuegos',2,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(5,2,'Señalización',3,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(6,3,'Gestión de Residuos',1,'2026-06-15 09:21:14','2026-06-15 09:21:14'),(7,3,'Emisiones',2,'2026-06-15 09:21:14','2026-06-15 09:21:14');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `cuit` varchar(20) DEFAULT NULL,
  `address` varchar(300) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cuit` (`cuit`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'YPF S.A.','30-54668997-9','Macacha Güemes 515, CABA','2026-06-15 00:32:04','2026-06-15 00:32:04'),(2,'Techint S.A.','30-65421789-4','Av. del Libertador 2537, CABA','2026-06-15 09:19:25','2026-06-15 09:19:25'),(3,'Pan American Energy','30-71234567-8','Reconquista 823, CABA','2026-06-15 09:20:15','2026-06-15 09:20:15');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_templates`
--

DROP TABLE IF EXISTS `form_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `revision` int(11) NOT NULL DEFAULT 1,
  `status` enum('active','obsolete') NOT NULL DEFAULT 'active',
  `templateGroupId` int(11) DEFAULT NULL COMMENT 'Agrupa todas las revisiones de un mismo formulario',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_templates`
--

LOCK TABLES `form_templates` WRITE;
/*!40000 ALTER TABLE `form_templates` DISABLE KEYS */;
INSERT INTO `form_templates` VALUES (1,'Formulario de Seguridad e Higiene',1,'obsolete',1,'2026-06-15 00:33:51','2026-06-15 01:21:59'),(2,'Formulario de Seguridad e Higiene',2,'active',1,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(3,'Formulario de Medio Ambiente',1,'active',3,'2026-06-15 09:21:14','2026-06-15 09:21:14');
/*!40000 ALTER TABLE `form_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_reports`
--

DROP TABLE IF EXISTS `inspection_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspection_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `formTemplateId` int(11) NOT NULL,
  `companyId` int(11) NOT NULL,
  `inspectionDate` date NOT NULL,
  `inspectorName` varchar(200) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('draft','completed') DEFAULT 'completed',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `formTemplateId` (`formTemplateId`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `inspection_reports_ibfk_1` FOREIGN KEY (`formTemplateId`) REFERENCES `form_templates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `inspection_reports_ibfk_2` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_reports`
--

LOCK TABLES `inspection_reports` WRITE;
/*!40000 ALTER TABLE `inspection_reports` DISABLE KEYS */;
INSERT INTO `inspection_reports` VALUES (1,1,1,'2026-06-15','Juan Pérez','Inspección rutinaria','completed','2026-06-15 01:19:30','2026-06-15 01:19:30'),(2,3,2,'2026-06-15','María González','Inspección ambiental semestral','completed','2026-06-15 09:27:54','2026-06-15 09:27:54'),(3,2,3,'2026-06-15','Carlos Ruiz','Inspección anual de seguridad','completed','2026-06-15 09:28:24','2026-06-15 09:28:24');
/*!40000 ALTER TABLE `inspection_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) NOT NULL,
  `text` text NOT NULL,
  `order` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,1,'¿Los tableros eléctricos están señalizados?',1,'2026-06-15 00:33:51','2026-06-15 00:33:51'),(2,1,'¿Las instalaciones tienen puesta a tierra?',2,'2026-06-15 00:33:51','2026-06-15 00:33:51'),(3,2,'¿Los matafuegos están vigentes?',1,'2026-06-15 00:33:51','2026-06-15 00:33:51'),(4,2,'¿Están ubicados en lugares accesibles?',2,'2026-06-15 00:33:51','2026-06-15 00:33:51'),(5,3,'¿Los tableros eléctricos están señalizados?',1,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(6,3,'¿Las instalaciones tienen puesta a tierra?',2,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(7,3,'¿Los cables están correctamente identificados?',3,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(8,4,'¿Los matafuegos están vigentes?',1,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(9,4,'¿Están ubicados en lugares accesibles?',2,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(10,5,'¿Las salidas de emergencia están señalizadas?',1,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(11,5,'¿Los equipos de seguridad están identificados?',2,'2026-06-15 01:21:59','2026-06-15 01:21:59'),(12,6,'¿Se clasifican los residuos correctamente?',1,'2026-06-15 09:21:14','2026-06-15 09:21:14'),(13,6,'¿Existe un plan de gestión de residuos peligrosos?',2,'2026-06-15 09:21:14','2026-06-15 09:21:14'),(14,6,'¿Los contenedores están identificados?',3,'2026-06-15 09:21:14','2026-06-15 09:21:14'),(15,7,'¿Se monitorean las emisiones atmosféricas?',1,'2026-06-15 09:21:14','2026-06-15 09:21:14'),(16,7,'¿Se cuenta con los permisos ambientales vigentes?',2,'2026-06-15 09:21:14','2026-06-15 09:21:14');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'inspection_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-15  6:35:34
