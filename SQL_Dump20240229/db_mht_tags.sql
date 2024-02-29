-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: db_mht
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `name` text,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (44,153,'dsfdsfdsfds'),(45,153,'בדיקת תגית'),(46,153,'בדיקה  נוספת'),(47,172,'שמות'),(48,175,'tertretretre'),(49,184,'בראשית'),(50,186,'ראראר'),(51,187,'trtretertert'),(52,188,'בראשית'),(53,191,'וירא'),(54,192,'לך לך'),(55,194,'בראשית'),(56,195,'שמות'),(57,196,'שמות'),(58,202,'jjj'),(59,202,'jkm'),(60,202,'[];lp'),(61,203,'wwwww'),(62,203,'rrrrrrrrrrrrrrr'),(63,212,'ויקרא'),(64,213,'ויקרא'),(65,214,'דברים'),(66,217,'ואתחנן'),(67,224,'iuyi'),(68,224,'uiiui'),(69,224,'yuiuiu'),(70,224,'uiuiui'),(71,225,'iuyi'),(72,225,'uiiui'),(73,225,'yuiuiu'),(74,225,'uiuiui'),(75,226,'שמות'),(76,226,'אמונה'),(77,226,'בטחון'),(78,229,'חסידות'),(79,229,'מוסר'),(80,230,'מוסר'),(81,232,'בריאת העולם'),(82,242,'GFGFDG'),(83,242,'DFGDFGDFG'),(84,242,'DGDFGDFG'),(85,242,'FDGDFGDFG'),(86,247,'חטא העגל'),(87,247,'משה'),(88,248,'משה'),(89,267,'יעכייחכ'),(90,267,' המני'),(91,268,' המני'),(92,269,'ררררררר'),(93,268,'בראשית'),(94,268,'ויקרא'),(95,266,'eeeeeeeeee');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-29 22:38:29
