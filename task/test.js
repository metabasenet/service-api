
const Web3 = require('web3');
const mysql  = require('mysql');  
 
const mnt_addr = '0xcb410a69f93d9961f8db6b04737c5b713c147da8';
const bridge_addr = '0x0873093DEb492A6425d85906E2CE6E856BCDC71F';

const config ={     
    host     : '127.0.0.1',       
    user     : 'mnt',              
    password : '1234qwer',       
    port: '3306',                   
    database: 'fruit',
    connectionLimit: 50, //
    queueLimit: 3 //
}
//var conn;

var pool = mysql.createPool(config);

//const conn = mysql.createConnection(config);
// function handleError (err) {
//     if (err) {        
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//         connect();
//         } else {
//         console.error(err.stack || err);
//         }
//     }
// }          
//conn.connect();
// function connect () {
//     conn = mysql.createConnection(config);
//     conn.connect(handleError);
//     conn.on('error', handleError);
//   }
 
//connect();


function add(obj) {
    let eventName=obj.eventName.charAt(0).toLowerCase() + obj.eventName.slice(1);
    pool.getConnection(function(err, connection) {    
        if(err){
            console.log(" Failed to establish connection with MySQL database: " + err);
        } else {
                //console.log(" Successfully established connection with MySQL database ");
                let sql = `SELECT count(*) as c from `+eventName+` where transactionHash = '${obj.transactionHash}'`;
                connection.query(sql, async(error, results) => {
                    if (error) throw error;
                    if (results[0].c == 0) {
                        switch(eventName){
                            case "popularize":{
                                sql = `INSERT INTO `+eventName+`(eventName,blockNumber,transactionHash,blockHash,timestamp,parent,children,\`cycle\`) VALUES(?,?,?,?,?,?,?,?)`;
                                connection.query(sql,[obj.eventName,obj.blockNumber,obj.transactionHash,obj.blockHash,obj.timestamp,obj.parent,obj.children,obj.cycle]);
                                break;
                            }
                            case "voteIn":{
                                sql = `INSERT INTO `+eventName+`(eventName,blockNumber,transactionHash,blockHash,timestamp,addr,\`cycle\`,\`value\`) VALUES(?,?,?,?,?,?,?,?)`;
                                connection.query(sql,[obj.eventName,obj.blockNumber,obj.transactionHash,obj.blockHash,obj.timestamp,obj.addr,obj.cycle,obj.value]);
                                break;
                            }
                            case "voteOut":{
                                sql = `INSERT INTO `+eventName+`(eventName,blockNumber,transactionHash,blockHash,timestamp,addr,\`cycle\`,\`value\`) VALUES(?,?,?,?,?,?,?,?)`;
                                connection.query(sql,[obj.eventName,obj.blockNumber,obj.transactionHash,obj.blockHash,obj.timestamp,obj.addr,obj.cycle,obj.value]);
                                break;
                            }
                            case "voteBack":{
                                sql = `INSERT INTO `+eventName+`(eventName,blockNumber,transactionHash,blockHash,timestamp,addr,\`cycle\`,\`value\`) VALUES(?,?,?,?,?,?,?,?)`;
                                connection.query(sql,[obj.eventName,obj.blockNumber,obj.transactionHash,obj.blockHash,obj.timestamp,obj.addr,obj.cycle,obj.value]);
                                break;
                            }
                            case "voteProfit":{
                                sql = `INSERT INTO `+eventName+`(eventName,blockNumber,transactionHash,blockHash,timestamp,addr,\`cycle\`,\`value\`) VALUES(?,?,?,?,?,?,?,?)`;
                                connection.query(sql,[obj.eventName,obj.blockNumber,obj.transactionHash,obj.blockHash,obj.timestamp,obj.addr,obj.cycle,obj.value]);
                                break;
                            }
                            case "preVoteProfit":{
                                sql = `INSERT INTO `+eventName+`(eventName,blockNumber,transactionHash,blockHash,timestamp,addr,\`cycle\`,fraction) VALUES(?,?,?,?,?,?,?,?)`;
                                connection.query(sql,[obj.eventName,obj.blockNumber,obj.transactionHash,obj.blockHash,obj.timestamp,obj.addr,obj.cycle,obj.fraction]);
                                break;
                            }
                        }                    
                       console.log('add success.');
                    } else {
                        console.log('Data already exists');
                    }          
                connection.release();
            })
        }
    })
}

// mainnet
//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// testnet
//const web3 = new Web3('https://data-seed-prebsc-2-s3.binance.org:8545');
//const web3=new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
const web3=new Web3('https://totems.metabasenet.site/bsc/');
     
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"parent","type":"address"},{"indexed":true,"internalType":"address","name":"children","type":"address"},{"indexed":true,"internalType":"uint256","name":"cycle","type":"uint256"}],"name":"Popularize","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"uint256","name":"cycle","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fraction","type":"uint256"}],"name":"PreVoteProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"uint256","name":"cycle","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"VoteBack","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"uint256","name":"cycle","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"VoteIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"uint256","name":"cycle","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"VoteOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"uint256","name":"cycle","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"valute","type":"uint256"}],"name":"VoteProfit","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"begin","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cycle","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"popularize","outputs":[{"internalType":"bool","name":"ret","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"temp","type":"address"},{"internalType":"uint8","name":"addr_v","type":"uint8"},{"internalType":"bytes32","name":"addr_r","type":"bytes32"},{"internalType":"bytes32","name":"addr_s","type":"bytes32"},{"internalType":"uint8","name":"temp_v","type":"uint8"},{"internalType":"bytes32","name":"temp_r","type":"bytes32"},{"internalType":"bytes32","name":"temp_s","type":"bytes32"}],"name":"popularize","outputs":[{"internalType":"bool","name":"ret","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"power_profit_whole","outputs":[{"internalType":"uint256","name":"power","type":"uint256"},{"internalType":"uint256","name":"profit","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"spreadChild","outputs":[{"internalType":"address[]","name":"addrs","type":"address[]"},{"internalType":"uint256[]","name":"votes","type":"uint256[]"},{"internalType":"uint256[]","name":"powers","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"spreadFraction","outputs":[{"internalType":"uint256","name":"power_","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"spreads","outputs":[{"internalType":"address","name":"parent","type":"address"},{"internalType":"uint256","name":"cycle","type":"uint256"},{"internalType":"uint256","name":"vote","type":"uint256"},{"internalType":"uint256","name":"vote_power","type":"uint256"},{"internalType":"uint256","name":"real_power","type":"uint256"},{"internalType":"uint256","name":"lock_vote","type":"uint256"},{"internalType":"uint256","name":"lock_time","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"spreads_length","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"voteBack","outputs":[{"internalType":"uint256","name":"ret","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"voteIn","outputs":[{"internalType":"uint256","name":"ret","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"voteMining","outputs":[{"internalType":"uint256","name":"mint","type":"uint256"},{"internalType":"uint256","name":"f","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"voteMining","outputs":[{"internalType":"uint256","name":"mint","type":"uint256"},{"internalType":"uint256","name":"f","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"voteOut","outputs":[{"internalType":"uint256","name":"ret","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"whole_power","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

 
const mnt = new web3.eth.Contract(abi,mnt_addr);
let firstBlockNumber=22246498;
//let firstBlockNumber=22480619;



async function Run() { 
    //connect();
    
    console.log('getBlockNumber...');   
    try{
        let height =  await web3.eth.getBlockNumber();  
        console.log('current block number:',height);
        let endBlockNumber=firstBlockNumber + 4000
        if (endBlockNumber > height){
            endBlockNumber=height;
        } 
        console.log('to block number:',endBlockNumber);
        mnt.getPastEvents('allEvents', {          
            fromBlock: firstBlockNumber,
            toBlock:  endBlockNumber 
        },
      ).then(async function(events) {
            for (const obj of events) {
                //console.log(obj);
                
                let eventName=obj.event;
                let blockNumber=obj.blockNumber;
                let result=obj.returnValues;
                let transactionHash=obj.transactionHash;
                let blockHash=obj.blockHash;
                let block =await web3.eth.getBlock(blockNumber);
                let timestamp =block.timestamp;

                //console.log(block);
                switch(eventName){
                    case "Popularize":{
                        let popularize={
                            blockNumber:blockNumber ,
                            eventName:eventName,
                            transactionHash:transactionHash,
                            blockHash:blockHash,
                            timestamp:timestamp,
                            parent: result.parent,
                            children: result.children,
                            cycle: result.cycle,
                        }
                        add(popularize);
                        break;
                    }
                    case "VoteIn":{
                        let voteIn={
                            blockNumber:blockNumber ,
                            eventName:eventName,
                            transactionHash:transactionHash,
                            blockHash:blockHash,
                            timestamp:timestamp,
                            addr: result.addr,
                            cycle: result.cycle,
                            value: result.value,
                        }
                        add(voteIn);
                        break;
                    }
                    case "VoteOut":{
                        let voteOut={
                            blockNumber:blockNumber ,
                            eventName:eventName,
                            transactionHash:transactionHash,
                            blockHash:blockHash,
                            timestamp:timestamp,
                            addr: result.addr,
                            cycle: result.cycle,
                            value: result.value,
                        }
                        add(voteOut);
                        break;
                    }
                    case "VoteBack":{
                        let voteBack={
                            blockNumber:blockNumber ,
                            eventName:eventName,
                            transactionHash:transactionHash,
                            blockHash:blockHash,
                            timestamp:timestamp,
                            addr: result.addr,
                            cycle: result.cycle,
                            value: result.value,
                        }
                        add(voteBack);
                        break;
                    }
                    case "VoteProfit":{
                        let voteProfit={
                            blockNumber:blockNumber ,
                            eventName:eventName,
                            transactionHash:transactionHash,
                            blockHash:blockHash,
                            timestamp:timestamp,
                            addr: result.addr,
                            cycle: result.cycle,
                            value: result.value,
                        }
                        add(voteProfit);
                        break;
                    }
                    case "PreVoteProfit":{
                        let preVoteProfit={
                            blockNumber:blockNumber ,
                            eventName:eventName,
                            transactionHash:transactionHash,
                            blockHash:blockHash,
                            timestamp:timestamp,
                            addr: result.addr,
                            cycle: result.cycle,
                            fraction: result.fraction,
                        }
                        add(preVoteProfit);
                        break;
                    }
                }
            //     console.log(obj);
            //    console.log(obj.event);
            //    console.log(obj.returnValues);
            //    console.log(obj.transactionHash);
            //    console.log(obj.blockHash);
            //    let result=obj.returnValues;
            //    console.log(result.addr);
            }
            // 5s
            setTimeout(Run, 10000);
      }).catch((err)=>{
          console.log(new Date(), err);
        setTimeout(Run, 10000);

      });
      firstBlockNumber=endBlockNumber;
    }catch(err){
        console.log(new Date(),err);
       setTimeout(Run, 10000);
    }

}
// async function Run(){
//     console.log("run");
//  web3.eth.getBlockNumber().then((result)=>{
//      console.log(result);
//  })
// }

Run();
