CREATE DATABASE  IF NOT EXISTS `mnt` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mnt`;
-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: mnt
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `K`
--

DROP TABLE IF EXISTS `K`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `K` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bn` int DEFAULT NULL,
  `index` int DEFAULT NULL,
  `reserve0` decimal(60,0) DEFAULT NULL,
  `reserve1` decimal(60,0) DEFAULT NULL,
  `price` decimal(40,18) DEFAULT NULL,
  `txid` varchar(66) DEFAULT NULL COMMENT '交易ID',
  `utc` int DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`id`),
  KEY `utc` (`utc`),
  KEY `index` (`bn`,`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `p_addr` varchar(42) DEFAULT NULL COMMENT '上级地址',
  `c_addr` varchar(42) DEFAULT NULL COMMENT '下级地址',
  `state` int DEFAULT '0' COMMENT '状态(0: 已签名，未绑定;1: 已绑定)',
  `sign` varchar(256) DEFAULT NULL COMMENT '签名数据',
  `utc` int DEFAULT NULL COMMENT '时间戳',
  `sign_utc` int DEFAULT NULL COMMENT '签名时间',
  `count` int DEFAULT '0' COMMENT '下级计数',
  `community` varchar(45) DEFAULT NULL COMMENT '社区名称',
  PRIMARY KEY (`id`),
  KEY `p` (`p_addr`),
  KEY `c` (`c_addr`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `txid` varchar(66) DEFAULT NULL,
  `bn` int DEFAULT NULL,
  `index` int DEFAULT NULL,
  `value` decimal(40,18) DEFAULT NULL,
  `addr` varchar(42) DEFAULT NULL,
  `utc` int DEFAULT NULL,
  `type` int DEFAULT NULL COMMENT '1: 收益(挖矿MNT),2:收益(团队USDT).  3: 购买(团队USDT),4:购买(去中心化交易所)',
  PRIMARY KEY (`id`),
  KEY `index` (`bn`,`index`),
  KEY `addr` (`addr`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'mnt'
--

--
-- Dumping routines for database 'mnt'
--
/*!50003 DROP PROCEDURE IF EXISTS `K` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`mnt`@`localhost` PROCEDURE `K`()
BEGIN
		select t.d, t.max_p, t.min_p, t1.price as end_p, t2.price as begin_p from (select FLOOR(utc / (3600 * 24)) as d, 
			max(id) as end_id, min(id) as begin_id, 
			max(price) as max_p, min(price) as min_p 
            from K where utc > unix_timestamp(now()) - (3600 * 24 * 30) group by FLOOR(utc / (3600 * 24))) t
        inner join K t1 on t.end_id = t1.id 
        inner join K t2 on t.begin_id = t2.id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateCount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`mnt`@`localhost` PROCEDURE `updateCount`(in id_ int)
BEGIN
	declare p_addr_ varchar(42);
	declare c_addr_ varchar(42);
	select p_addr, c_addr into p_addr_, c_addr_ from friends where id = id_;
    
	delete from friends where p_addr = p_addr_ and c_addr = c_addr_ and id != id_;
	update friends set state = 1,utc = unix_timestamp(now()) where id = id_;
    
	while exists(select id from friends where c_addr = p_addr_ and state = 1) do
		update friends set count = count + 1 where c_addr = p_addr_ and state = 1;
		select p_addr into p_addr_ from friends where c_addr = p_addr_ and state = 1;
	end while;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-01 19:20:57