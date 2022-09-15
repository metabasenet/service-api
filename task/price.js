const Web3 = require('web3');
const mysql  = require('mysql');
const BigNumber = require('bignumber.js');

// mainnet
//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// testnet
//const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
//const web3=new Web3('https://shangqingdong.work/bsc/');
const web3=new Web3('https://totems.metabasenet.site/bsc/');

const abi = [{
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "uint112",
		"name": "reserve0",
		"type": "uint112"
	}, {
		"indexed": false,
		"internalType": "uint112",
		"name": "reserve1",
		"type": "uint112"
	}],
	"name": "Sync",
	"type": "event"
}];


//const lp_addr = '0x82260d3f8c98e90a4ec0dcf709e2ad8f592ea941';
const lp_addr = '0x72E5080Ea8b8878A78f0C83e375c2b86d4D92Bc1';


const lp_con = new web3.eth.Contract(abi,lp_addr);

//const begin_height = 18580240;
const begin_height=21284708;
let height = 0;
let height_setup = 5000;

const conn = mysql.createConnection({     
    host     : '127.0.0.1',       
    user     : 'mnt',              
    password : '1234qwer',       
    port: '3306',                   
    database: 'mnt'});

conn.connect();

function query(sql,params) {
    return new Promise(fun => {
        conn.query(sql,params,function(err,result) {
            if (err) {
                return;
            }   
            fun(result);
        });
    });
};


async function Add(txid,reserve0,reserve1,blockNumber) {
    let sql = `SELECT count(*) as c from uniswap where txid = '${txid}'`;
    let ret = await query(sql,[]);
    if (ret[0].c == 0) {
        const bg0 = BigNumber(reserve0);
        const bg1 = BigNumber(reserve1);
        const price = bg1.dividedBy(bg0).toFixed(18);
        let b = await web3.eth.getBlock(blockNumber);
        sql = `insert into uniswap(height,reserve0,reserve1,price,txid,timestamp)value(${blockNumber},'${reserve0}','${reserve0}',${price},'${txid}',${b.timestamp})`;
        await query(sql);
        console.log('Add ok.',txid);

        let priceSql="select  price  from uniswap where FROM_UNIXTIME(timestamp,'%Y-%m-%d') != CURDATE() order by height desc  limit 1 ";
        let priceRet=await query(priceSql,[]);
        let price24h=price;
        if(priceRet.length>0){
            price24h=priceRet[0].price;        
        }else{
            priceSql="select  price  from uniswap limit 1 ";
            priceRet=await query(priceSql,[]);
            if(priceRet.length>0){
                 price24h=priceRet[0].price;               
            }
        }
        let price6=parseFloat(price).toFixed(6);     
        let selectSql ="select * from quotations where tradePairId ='MNT/USDT'";
        let selectRet= await query(selectSql);
        let updateSql =`update quotations set price=${price6},price24h=${price24h}  where tradePairId ='MNT/USDT'`;
        if (selectRet.length==0){
            updateSql=`insert into quotations(tradePairId, price, precision, price24h) values ('MNT/USDT',${price6},8,${price24h})`;
        } 
        await query(updateSql);
        console.log('update price ok.',price);

    } else {
        console.log("Already exists.",txid);
    }
}

async function Run() {
    let new_height=0;
    try{
          new_height = await web3.eth.getBlockNumber();
    }catch(error){
        console.log( new Date() ,'getBlockNumber error',error);
        setTimeout(Run, 10000);
        return;
    }
    //const new_height = await web3.eth.getBlockNumber();
    // let new_height=0;
    // await web3.eth.getBlockNumber().then((result)=>{
    //     new_height=result;

    // }).catch((error)=>{
    //     console.log( new Date() ,'getBlockNumber error',error);
    //     setTimeout(Run, 10000);
    //     return;
    // });
 
    console.log(new Date(),'getBlockNumber',new_height) ;     
    let to_height = 0;
    let from_height = 0;

    if (new_height - height > height_setup) {
        from_height = height;
        to_height = height + height_setup;
        height = height + height_setup;
    } else {
        from_height = height;
        to_height = 'latest';
    }
    console.log(from_height,to_height);
    lp_con.getPastEvents('Sync', {
        fromBlock: from_height,
        toBlock:  to_height
    },
  ).then(async events => {
        for (const obj of events) {
            //console.log(obj);
            await Add(obj.transactionHash,obj.returnValues["reserve0"],obj.returnValues["reserve1"],obj.blockNumber);
        }
        if (new_height - height > 5000) {
            height_setup = 5000;
            setTimeout(Run, 1000);
            console.log(`new_height-height : ${new_height - height}, height_setup : ${height_setup}`);
        } else if (new_height - height > 500) {
            height_setup = 500;
            setTimeout(Run, 5000);
            console.log(`new_height-height : ${new_height - height}, height_setup : ${height_setup}`);
        } else {
            height_setup = 50;
            setTimeout(Run, 10000);
            console.log(`new_height-height : ${new_height - height}, height_setup : ${height_setup}`);
        }
        UpdateHeight(height);
  }).catch((error)=>{
    console.log( new Date() ,'getPastEvents error',error);
    setTimeout(Run, 10000);
  });
}

async function UpdateHeight(height_) {
    //console.log(height_);
    let sql = `select * from uniswap where id = 1`;
    let ret = await query(sql);
    if (ret.length == 0) {
        sql = `insert into uniswap(id,height)value(1,${height_})`;
    } else {
        sql = `update uniswap set height = ${height_} where id = 1`;
    }
    await query(sql);
}
async function Main() {
    const ret = await query(`SELECT IFNULL(max(height), 0) as height FROM uniswap`);
    if (ret[0].height == 0) {
        UpdateHeight(begin_height);
        height = begin_height;
    } else {
        height = ret[0].height;
    }
    Run();
}

Main();
