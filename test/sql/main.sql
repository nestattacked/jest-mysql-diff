DROP TABLE IF EXISTS `table1`;
CREATE TABLE `table1` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `int` int(255) DEFAULT NULL,
  `varchar` varchar(255) DEFAULT NULL,
  `text` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `table1` VALUES ('1', '1', 'one', 'one');
INSERT INTO `table1` VALUES ('2', '2', 'two', 'two');
INSERT INTO `table1` VALUES ('3', '3', 'three', 'three');

DROP TABLE IF EXISTS `table2`;
CREATE TABLE `table2` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `int` int(255) DEFAULT NULL,
  `varchar` varchar(255) DEFAULT NULL,
  `text` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `table2` VALUES ('1', '1', 'one', 'one');
INSERT INTO `table2` VALUES ('2', '2', 'two', 'two');
INSERT INTO `table2` VALUES ('3', '3', 'three', 'three');