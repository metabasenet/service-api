popularizedrop table if exists 	`popularize`;
CREATE TABLE `popularize` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) DEFAULT NULL,
  `blockNumber` int(11) DEFAULT NULL, 
  `transactionHash` varchar(128) DEFAULT NULL,
  `blockHash` varchar(128)  DEFAULT NULL, 
  `timestamp` int(11) DEFAULT NULL,
  `parent` varchar(64) default null,
  `children` varchar(64) default null,
  `cycle` int(11) default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


drop table if exists 	`voteIn`;
CREATE TABLE `voteIn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) DEFAULT NULL,
  `blockNumber` int(11) DEFAULT NULL, 
  `transactionHash` varchar(128) DEFAULT NULL,
  `blockHash` varchar(128)  DEFAULT NULL, 
  `timestamp` int(11) DEFAULT NULL,
  `addr` varchar(64) default null,
  `cycle` int(11) default null,
  `value` varchar(64) default null,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

drop table if exists 	`voteOut`;
CREATE TABLE `voteOut` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) DEFAULT NULL,
  `blockNumber` int(11) DEFAULT NULL, 
  `transactionHash` varchar(128) DEFAULT NULL,
  `blockHash` varchar(128)  DEFAULT NULL, 
  `timestamp` int(11) DEFAULT NULL,
  `addr` varchar(64) default null,
  `cycle` int(11) default null,
  `value` varchar(64) default null,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


drop table if exists 	`voteBack`;
CREATE TABLE `voteBack` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) DEFAULT NULL,
  `blockNumber` int(11) DEFAULT NULL, 
  `transactionHash` varchar(128) DEFAULT NULL,
  `blockHash` varchar(128)  DEFAULT NULL, 
  `timestamp` int(11) DEFAULT NULL,
  `addr` varchar(64) default null,
  `cycle` int(11) default null,
  `value` varchar(64) default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

drop table if exists 	`voteProfit`;
CREATE TABLE `voteProfit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) DEFAULT NULL,
  `blockNumber` int(11) DEFAULT NULL, 
  `transactionHash` varchar(128) DEFAULT NULL,
  `blockHash` varchar(128)  DEFAULT NULL, 
  `timestamp` int(11) DEFAULT NULL,
  `addr` varchar(64) default null,
  `cycle` int(11) default null,
  `value` varchar(64) default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

drop table if exists 	`preVoteProfit`;
CREATE TABLE `preVoteProfit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `eventName` varchar(64) DEFAULT NULL,
  `blockNumber` int(11) DEFAULT NULL, 
  `transactionHash` varchar(128) DEFAULT NULL,
  `blockHash` varchar(128)  DEFAULT NULL, 
  `timestamp` int(11) DEFAULT NULL,
  `addr` varchar(64) default null,
  `cycle` int(11) default null,
  `fraction` varchar(64) default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
