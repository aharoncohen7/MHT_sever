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
-- Table structure for table `passwords`
--

DROP TABLE IF EXISTS `passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwords` (
  `userId` int DEFAULT NULL,
  `password` text,
  KEY `userId` (`userId`),
  CONSTRAINT `passwords_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwords`
--

LOCK TABLES `passwords` WRITE;
/*!40000 ALTER TABLE `passwords` DISABLE KEYS */;
INSERT INTO `passwords` VALUES (1,'hildegard.org'),(2,'anastasia.net'),(3,'ramiro.info'),(4,'kale.biz'),(5,'demarco.info'),(6,'ola.org'),(7,'elvis.io'),(8,'jacynthe.com'),(9,'conrad.com'),(10,'ambrose.net'),(37,'ac1985'),(38,'as43534'),(1,'aA12345'),(2,'aA12345'),(3,'aA12345'),(4,'aA12345'),(5,'aA12345'),(6,'aA12345'),(7,'aA12345'),(8,'aA12345'),(9,'aA12345'),(10,'aA12345'),(39,'Aa1234'),(40,'Aa1234'),(41,'Aa1234'),(42,'NAMBER911'),(43,'NAMBE11999'),(44,'NAMBE11999'),(45,'\'NAMBE1199'),(46,'\'NAMBE1199'),(47,'\'NAMBE1199'),(48,'\'NAMBE1199'),(49,'\'NAMBE1199'),(50,'naber00');
/*!40000 ALTER TABLE `passwords` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-29 22:38:30
