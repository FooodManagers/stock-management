CREATE DATABASE  IF NOT EXISTS `stockmanagementdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `stockmanagementdb`;
-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: localhost    Database: stockmanagementdb
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED='dc7a9a12-b8bf-11f0-baf7-0b5eb77c47f0:1-92';

--
-- Table structure for table `favorite_recipe`
--

DROP TABLE IF EXISTS `favorite_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorite_recipe` (
  `favorite_recipe_id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(255) NOT NULL,
  `category_small_id` int DEFAULT NULL,
  `category_medium_id` int DEFAULT NULL,
  `category_large_id` int DEFAULT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`favorite_recipe_id`),
  KEY `mail` (`mail`),
  CONSTRAINT `favorite_recipe_ibfk_1` FOREIGN KEY (`mail`) REFERENCES `users` (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_recipe`
--

LOCK TABLES `favorite_recipe` WRITE;
/*!40000 ALTER TABLE `favorite_recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `jan_code` bigint NOT NULL,
  `goods_name` varchar(255) DEFAULT NULL,
  `image_url` varchar(2048) DEFAULT NULL,
  `brand_name` varchar(100) DEFAULT NULL,
  `maker_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`jan_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_list`
--

DROP TABLE IF EXISTS `shopping_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shopping_list` (
  `shopping_list_id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_checked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`shopping_list_id`),
  KEY `mail` (`mail`),
  CONSTRAINT `shopping_list_ibfk_1` FOREIGN KEY (`mail`) REFERENCES `users` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_list`
--

LOCK TABLES `shopping_list` WRITE;
/*!40000 ALTER TABLE `shopping_list` DISABLE KEYS */;
INSERT INTO `shopping_list` VALUES (5,'test@trident.ac.jp','コーラ',0,'2025-11-16 16:37:52'),(6,'test@trident.ac.jp','牛乳',0,'2025-11-16 17:24:13');
/*!40000 ALTER TABLE `shopping_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock` (
  `stock_id` int NOT NULL AUTO_INCREMENT,
  `jan_code` bigint DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `expiration_date` date DEFAULT NULL,
  `expiration_type` enum('賞味期限','消費期限','なし') NOT NULL,
  `buy_date` date DEFAULT NULL,
  `recipe_name` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `has_expiration` tinyint(1) NOT NULL,
  PRIMARY KEY (`stock_id`),
  KEY `jan_code` (`jan_code`),
  KEY `mail` (`mail`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`jan_code`) REFERENCES `product` (`jan_code`),
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`mail`) REFERENCES `users` (`mail`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,NULL,'豆腐','2025-02-06','賞味期限','2025-01-02','豆腐','test@trident.ac.jp',1,0),(2,NULL,'キャベツ','2025-01-31','賞味期限','2025-01-02','キャベツ','test@trident.ac.jp',1,0),(3,NULL,'天然水','2025-11-18','賞味期限','2025-11-16','','test@trident.ac.jp',1,0);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('test@example.com','$2a$10$3NsjKTw2vjZsHvNhTviAo..3tSoe/3fbtNqes07orXgG9QVsbmQ12'),('test@trident.ac.jp','$2b$10$0vp9Kbvt5penCizqoFjef.9dT0A371QvuRPORldMqe2bPHGBQ89sW'),('test2@example.com','$2a$10$bsAHIJwQ1j2.C8OJcoG.7.Yl61AvBjyuDBqV3WaGECK7SoFjgzwQ.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-17 14:40:59
