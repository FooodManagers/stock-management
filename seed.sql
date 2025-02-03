CREATE DATABASE  IF NOT EXISTS `stockmanagementdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `stockmanagementdb`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: stockmanagementdb
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `favorite_recipe`
--

DROP TABLE IF EXISTS `favorite_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `product` VALUES (4902102072618,'コカ・コーラ 2008 500ML PET','https://image.jancodelookup.com/4902102072618.jpg','コカ・コーラ','日本コカ・コーラ株式会社'),(4902555264875,'不二家 アンパンマンペロペロチョコ 1本','https://image.jancodelookup.com/4902555264875.jpg','不二家','株式会社不二家'),(4902750905450,'ぷっちょ ストロングソーダ スティック(10粒入)','https://image.jancodelookup.com/4902750905450.jpg','UHA味覚糖','ユーハ味覚糖株式会社'),(4902750905498,'ぷっちょ ストロングコーラ スティック(10粒入)','https://image.jancodelookup.com/4902750905498.jpg','UHA味覚糖','ユーハ味覚糖株式会社'),(4903333219636,'ロッテ トッポ 2袋','https://image.jancodelookup.com/4903333219636.jpg','ロッテ','株式会社ロッテ'),(4904230074250,'アサヒ スタイルバランスヨーグルトサワーテイストノンアル缶 350ml','https://image.jancodelookup.com/4904230074250.jpg','アサヒ','アサヒビール株式会社'),(4967576492973,'アイリスオーヤマ アイリスの天然水 富士山の天然水 500ml','https://image.jancodelookup.com/4967576492973.jpg','アイリスオーヤマ','アイリスオーヤマ株式会社'),(4987910003092,'ダイドー TAアリナミン メディカルバランス ソーダ風味 100ml','https://image.jancodelookup.com/4987910003092.jpg','ダイドー','アリナミン製薬株式会社'),(4987973121580,'コルゲンコーワ滋養チャージ 100ml','https://image.jancodelookup.com/4987973121580.jpg','コルゲンコーワ','興和株式会社');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,NULL,'豆腐','2025-01-31','賞味期限','2025-01-02','豆腐','test@trident.ac.jp',2,0),(2,NULL,'キャベツ','2025-01-31','賞味期限','2025-01-02','キャベツ','test@trident.ac.jp',1,0),(3,NULL,'鶏肉','2025-01-20','賞味期限','2025-01-02','鶏肉','test@trident.ac.jp',1,1),(4,NULL,'うどん','2025-01-31','賞味期限','2025-01-02','うどん','test@trident.ac.jp',1,1),(5,NULL,'豚肉','1990-01-01','なし','2025-01-07','豚肉',NULL,1,0),(8,NULL,'ソース','2025-01-21','賞味期限','2025-01-07','ソース','test@trident.ac.jp',2,0),(10,NULL,NULL,'2025-07-01','賞味期限','2025-01-16','',NULL,1,0),(13,4903333219636,'ロッテ トッポ 1袋','2025-09-05','賞味期限','2025-01-17','','test@trident.ac.jp',3,0),(23,4902102072618,'コカ・コーラ 2008 500ML PET','2025-04-04','賞味期限','2025-01-22','','test@trident.ac.jp',2,0);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
INSERT INTO `users` VALUES ('test@trident.ac.jp','$2b$10$0vp9Kbvt5penCizqoFjef.9dT0A371QvuRPORldMqe2bPHGBQ89sW'),('test2@trident.ac.jp','$2b$10$tM5ENRL1lNfQv0fT.U9NsOD63tw33PZdhhM926EjWa1gF.jD1zgLm');
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

-- Dump completed on 2025-02-03 16:05:30
