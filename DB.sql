-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: us-cdbr-east-03.cleardb.com    Database: heroku_cbe7d1675678dee
-- ------------------------------------------------------
-- Server version	5.6.50-log

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
-- Table structure for table `adminusers`
--

DROP TABLE IF EXISTS `adminusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminusers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminusers`
--

LOCK TABLES `adminusers` WRITE;
/*!40000 ALTER TABLE `adminusers` DISABLE KEYS */;
INSERT INTO `adminusers` VALUES (4,'Listify Admin','$2b$10$Ex31RrwSG5Vz/uuHs7BnaOPOyfm2q9pUAwkPNgKncBa8buCXhbt1y');
/*!40000 ALTER TABLE `adminusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listitems`
--

DROP TABLE IF EXISTS `listitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `listId` int(11) DEFAULT NULL,
  `item` varchar(500) DEFAULT NULL,
  `isChecked` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `listId` (`listId`),
  CONSTRAINT `listitems_ibfk_1` FOREIGN KEY (`listId`) REFERENCES `lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=584 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listitems`
--

LOCK TABLES `listitems` WRITE;
/*!40000 ALTER TABLE `listitems` DISABLE KEYS */;
INSERT INTO `listitems` VALUES (64,104,'klsjfklsj',0),(84,104,'lksdjfl',1),(94,104,'sdlfj',0),(124,104,'sdljfklsd',1),(134,104,'lwjklad',0),(174,204,'sldjfs;d',1),(184,204,'sldjfklsjdf',0),(194,194,'dlsjflkds',1),(214,194,'skdjf;',0),(224,224,'changed',0),(234,224,'slkjfls',1),(244,224,'slkmfdlk',0),(254,124,'Good Will Hunting',0),(264,124,'Avengers: Endgame',0),(274,144,'Avengers: Endgame',1),(284,144,'Ironman ',0),(294,234,'chicken',1),(314,284,'Shirt',1),(324,234,'peppers',1),(334,234,'onions',0),(344,234,'rice',1),(354,234,'brocolli',0),(364,234,'mushrooms',0),(374,294,'shoes',1),(384,294,'make up',1),(394,294,'toothpaste',0),(404,294,'toothbrush',1),(414,294,'t-shirts',0),(424,144,'Avengers: Age of Ultron',1),(434,144,'Captain America: Civil War',0),(444,14,'coffee table',0),(454,14,'present for grandma',1),(464,14,'new silverware',0),(474,14,'rolling pin',0),(484,4,'COMP 4537 project',1),(494,4,'pick up laundry',0),(504,4,'study for OS final',0),(514,304,'mushrooms',0),(524,304,'carrots',1),(534,304,'peppers',0),(544,304,'broccoli',1),(554,304,'pasta',0),(564,304,'ice cream',1),(574,304,'rice',0);
/*!40000 ALTER TABLE `listitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lists`
--

DROP TABLE IF EXISTS `lists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `listName` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=314 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lists`
--

LOCK TABLES `lists` WRITE;
/*!40000 ALTER TABLE `lists` DISABLE KEYS */;
INSERT INTO `lists` VALUES (4,4,'To Do'),(14,4,'Shopping'),(64,44,'Packin'),(74,34,'To Do'),(104,34,'To Do'),(114,44,'To do list'),(124,44,'Movies to watch'),(134,44,'Things to remember for next week'),(144,4,'Movies to Watch'),(164,54,'Shopping'),(184,54,'Movies to Watch'),(194,54,'To Do'),(204,54,'Reminders'),(214,64,'To Do'),(224,64,'Shopping'),(234,84,'groceries'),(244,94,'Shopping'),(254,94,'To Do'),(264,94,'Reminders'),(274,94,'Movies to Watch'),(284,94,'Packing'),(294,4,'Packing'),(304,4,'Groceries');
/*!40000 ALTER TABLE `lists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stats`
--

DROP TABLE IF EXISTS `stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stats` (
  `method` varchar(100) NOT NULL DEFAULT '',
  `endpoint` varchar(255) NOT NULL DEFAULT '',
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`method`,`endpoint`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stats`
--

LOCK TABLES `stats` WRITE;
/*!40000 ALTER TABLE `stats` DISABLE KEYS */;
INSERT INTO `stats` VALUES ('DELETE','/API/V1/list/listId',143),('DELETE','/API/V1/list/listId/listItemId',113),('GET','/API/V1/admin/statistics',37),('GET','/API/V1/list/listId',42),('GET','/API/V1/list/listId/listItem',407),('GET','/API/V1/list/listId/name',253),('GET','/API/V1/list/userId',728),('GET','/API/V1/user/:userId/username',87),('POST','/API/V1/admin',84),('POST','/API/V1/list/listId/listItem',189),('POST','/API/V1/list/userId',216),('POST','/API/V1/user',46),('POST','/API/V1/user/login',96),('PUT','/API/V1/list/listId',65),('PUT','/API/V1/list/listId/listItemId',258),('PUT','/API/V1/preferences/userId',47);
/*!40000 ALTER TABLE `stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpreferences`
--

DROP TABLE IF EXISTS `userpreferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userpreferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userpreferences_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpreferences`
--

LOCK TABLES `userpreferences` WRITE;
/*!40000 ALTER TABLE `userpreferences` DISABLE KEYS */;
INSERT INTO `userpreferences` VALUES (4,4,'barbie'),(14,24,'bootstrap'),(24,34,'canucks'),(34,44,'canucks-retro'),(44,54,'barbie'),(54,64,'bootstrap'),(64,84,'bootstrap'),(74,94,'nautical');
/*!40000 ALTER TABLE `userpreferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Krystal','krystal.w221@gmail.com','$2a$10$175rOKH8mXI7aep9/A8/NOeq6l37mua1MrYceufrVuKm6JXtfswHa'),(24,'Steve Rogers','steve@gmail.com','$2a$10$EuDSJcKYGd/TUuusOKcJxOR1Qo.di/2Zs22rOPhPVQFCDRnYMOW9O'),(34,'Krystal','krystal@live.ca','$2a$10$57JS9UpqetUcb1dH6U2TeO1iGsQp6IXonPunkZG19G7l5tDOEzXsy'),(44,'Theo','theorenleveille22@gmail.com','$2a$10$aTCoPKL0Tb9B6n//lzv.F.kTdkGsN9nxHUcSOO8oSz.ObGtJaGpEG'),(54,'Krystal','krystal.w94@hotmail.com','$2a$10$zFgHyiD9zqT/8kapSSiiUO9zmXwdvHnyFqq6u9atfgIglwBF.LtGq'),(64,'Wanda','wanda@gmail.com','$2a$10$3C03MozQnMgm/Pmz.bqEWuWwDvTJc.FfXgWyL.wItRKh.Dy7wYpt2'),(84,'Theoren','tleveille@my.bcit.ca','$2a$10$WrCeZXbpxAoyV9faFm0oJeYLCe8EXA0SUumFytQD6NPpDE/ByevIy'),(94,'Barbara','barbaraliskov@gmail.com','$2a$10$CrjAgfdFeLO1SIbrRJHOL.IFi7V3.ck.xE.LwsYF3RAzWxEHKscPG');
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

-- Dump completed on 2021-04-10 18:14:49
