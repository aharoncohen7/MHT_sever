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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `username` text,
  `email` text,
  `phone` text,
  `isAdmin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Leanne Graham','Bret','Sincere@april.biz','1-770-736-8031 x56442',0),(2,'Ervin Howell','Antonette','Shanna@melissa.tv','010-692-6593 x09125',0),(3,'Clementine Bauch','Samantha','Nathan@yesenia.net','1-463-123-4447',0),(4,'Patricia Lebsack','Karianne','Julianne.OConner@kory.org','493-170-9623 x156',0),(5,'Chelsey Dietrich','Kamren','Lucio_Hettinger@annie.ca','(254)954-1289',0),(6,'Mrs. Dennis Schulist','Leopoldo_Corkery','Karley_Dach@jasper.info','1-477-935-8478 x6430',0),(7,'Kurtis Weissnat','Elwyn.Skiles','Telly.Hoeger@billy.biz','210.067.6132',0),(8,'Nicholas Runolfsdottir V','Maxime_Nienow','Sherwood@rosamond.me','586.493.6943 x140',0),(9,'Glenna Reichert','Delphine','Chaim_McDermott@dana.io','(775)976-6794 x41206',0),(10,'Clementina DuBuque','Moriah.Stanton','Rey.Padberg@karina.biz','024-648-3804',0),(37,'ahron cohen','a_cohen','aharoncohen7@GMAIL.COM','0527121418',1),(38,'chaim','a_levi','an7@GMAIL.COM','0556987456',1),(39,'אהרן','a_cu','aharoncohen@GMAIL.COM','0527121418',0),(40,'אהרן','a_cu','aharoncohe@GMAIL.COM','0527121418',0),(41,'אהרן','a_cu','aharoncoh@GMAIL.COM','0527121418',0),(42,'ahron','Antonette66666','ahar@fcgggg.gmail','0556987456',0),(43,'ahron','Antonette666660','ahar@fcgggg.gmail.com','0556987456',0),(44,'ahron','Antonette66','ahar@fcggg.gmail.com','0556987456',0),(45,'כככככככככככככככככככ','Antonetteפ','ahaםםroncohen7@GMAIL.COM','0556987456',0),(46,'כככככככככככככככככככ','Anton','ahan7@GMAIL.COM','0556987456',0),(47,'כככככככככככככככככככ','Antonפ','ahan7@GMAIL.CO','0556987456',0),(48,'כככככככככככככככככככ','Antonפ','ahan7@GAIL.CO','0556987456',0),(49,'כככככככככככככככככככ','Antonפ','ahfan7@GAIL.CO','0556987456',0),(50,'ahron','Antonette','aharfffffffcohen7@GMAIL.COM','0527121418',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
