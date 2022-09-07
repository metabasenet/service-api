const Web3 = require('web3');
const mysql  = require('mysql');  
 
const mnt_addr = '0x450af0a7c8372eee72dd2e4833d9aac4928c151f';
//const bridge_addr = '0x0873093DEb492A6425d85906E2CE6E856BCDC71F';
const bridge_addr = '0x08f9BA8014Ba6f2150287F778f03E9aE6b1FF398';

const config ={     
    host     : '127.0.0.1',       
    user     : 'mnt',              
    password : '1234qwer',       
    port: '3306',                   
    database: 'mnt',
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

function Add(txid,from,value,blockNumber) {
    pool.getConnection(function(err, connection) {    
        if(err){
            console.log(" Failed to establish connection with MySQL database: " + err);
        } else {
                //console.log(" Successfully established connection with MySQL database ");
                let sql = `SELECT count(*) as c from mnt_bsc where bsc_txid = '${txid}'`;
                connection.query(sql, async(error, results) => {
                    if (error) throw error;
                    if (results[0].c == 0) {
                        const b = await web3.eth.getBlock(blockNumber);
                        sql = `INSERT INTO mnt_bsc(bsc_txid,\`from\`,\`to\`,\`value\`,\`type\`,mnt_time) VALUES(?,?,?,?,1,?)`;
                        connection.query(sql,[txid,from,bridge_addr, web3.utils.fromWei(value,'ether'),b.timestamp]);
                        console.log('add success.');
                    } else {
                        console.log('Data already exists');
                    } 
                // Release connection return connection 
                connection.release();        
                // Close the connection pool with the end method of the connection pool object 
                //pool.end();
            })
        }
    })
}

// mainnet
//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// testnet
//const web3 = new Web3('https://data-seed-prebsc-2-s3.binance.org:8545');
//const web3=new Web3('https://shangqingdong.work/bsc/');
const web3=new Web3('https://totems.metabasenet.site/bsc/');
const abi = [{
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "Transfer",
	"type": "event"
}];

const mnt = new web3.eth.Contract(abi,mnt_addr);

async function Run() { 
    //connect();
    console.log('getBlockNumber...');   
    try{
        let height =  await web3.eth.getBlockNumber();  
        console.log('height',height); 
        height = height - 4000;
        mnt.getPastEvents('Transfer', {
            filter: {to: bridge_addr},
            fromBlock: height,
            toBlock:  'latest'
        },
      ).then(function(events) {
            for (const obj of events) {
                Add(obj.transactionHash,obj.returnValues["0"],obj.returnValues["2"],obj.blockNumber);
            }
            // 5s
            setTimeout(Run, 10000);
      }).catch((err)=>{
          console.log(new Date(), err);
        setTimeout(Run, 10000);

      });
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
