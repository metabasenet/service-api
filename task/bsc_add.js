const Web3 = require('web3');
const mysql  = require('mysql');  

const mnt_addr = '0x450af0a7c8372eee72dd2e4833d9aac4928c151f';
const bridge_addr = '0x0873093DEb492A6425d85906E2CE6E856BCDC71F';

const conn = mysql.createConnection({     
            host     : '127.0.0.1',       
            user     : 'mnt',              
            password : '1234qwer',       
            port: '3306',                   
            database: 'mnt'});
conn.connect();

function Add(txid,from,value,blockNumber) {
    let sql = `SELECT count(*) as c from mnt_bsc where bsc_txid = '${txid}'`;
    conn.query(sql, async (error, results, fields) => {
        if (error) throw error;
        if (results[0].c == 0) {
            const b = await web3.eth.getBlock(blockNumber);
            sql = `INSERT INTO mnt_bsc(bsc_txid,\`from\`,\`to\`,\`value\`,\`type\`,mnt_time) VALUES(?,?,?,?,1,?)`;
            conn.query(sql,[txid,from,bridge_addr, web3.utils.fromWei(value,'ether'),b.timestamp]);
            console.log('add success.');
        } else {
            console.log('Data already exists');
        }
    });
}

// mainnet
//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// testnet
//const web3 = new Web3('https://data-seed-prebsc-2-s3.binance.org:8545');
const web3=new Web3('https://shangqingdong.work/bsc/');
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
           // setTimeout(Run, 5000);
      });
    }catch(err){
        console.log(new Date(),err);
        //setTimeout(Run, 5000);
    }

}
// async function Run(){
//     console.log("run");
//  web3.eth.getBlockNumber().then((result)=>{
//      console.log(result);
//  })
// }

Run();
