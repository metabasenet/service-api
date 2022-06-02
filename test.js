const lib = require('./lib.js');
let querypool =require('./pool.js');
const express = require('express');
const app = express();
let transaction = {
    "txid" : "19ca625abc471e69bd33b2b6fe6333c3945d164da02c650eb06326e4f910692f",
    "version" : 1,
    "type" : "token",
    "time" : 1650113607,
    "nonce" : 1,
    "from" : "1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58",
    "to" : "1f1bt076cwdydnje00apvr3q8g68270x61fw1ste4pnb5ghr5mqympmzj",
    "amount" : "20.0000000000",
    "gaslimit" : 20000,
    "gasprice" : "0.0000010000",
    "gasused" : 20000,
    "txfee" : "0.0200000000",
    "data" : "00",
    "sig" : "4f30b5e651b5c516ec18ccb5a359c3af3353518925e8a77b07383a36f902c7ab100f84c2c6b76534674fcafa38dc889e3c6e76290b157b2cd4f0d2e4169f4d06",
    "fork" : "000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c7",
    "height" : 0,
    "blockhash" : "",
    "serialization":"0100000047bc5a62000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c701000000000000000177f2b1217377f62cbb34c5b72b63c6c17fdb5e9e0b6173b4edcb19d03922c0f501fda505475856b5c4e91cf80ba683239081e80ebcad02c0c9da7ce3cc1ca057780000000000000000000000000000000000000000000000000000002e90edd00000000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000004e2000404f30b5e651b5c516ec18ccb5a359c3af3353518925e8a77b07383a36f902c7ab100f84c2c6b76534674fcafa38dc889e3c6e76290b157b2cd4f0d2e4169f4d06"
}

const ts = transaction.time;
const fork = transaction.fork; 
const nonce = transaction.nonce; 
const from = transaction.from;   
const to = transaction.to;       
const amount = transaction.amount;    
const gasPrice = transaction.gasprice;    
const gasLimit = transaction.gaslimit;    
const ret1 = lib.GetTx(ts, fork, nonce, from, to, amount, gasPrice, gasLimit, transaction.data);

console.log(ret1.tx_hash);
console.log("969e0fde99c16fc03ebfc35286a24c77004c2018917235beb6c8f5a47a403c94");



// query("SELECT * from search where Rst > ?",[10],function(err,vals,fields){
//     //do something
//     console.log('The results is: ', vals);
// });

function query(sql, params) {
    return new Promise(fun => {
        querypool(sql,params,function(err,ret,fields){
           // console.log('err',err)
           // console.log('ret',ret);
            if(err){
                fun(err);
                return;
            }
            fun(ret);
        });
    });
  };

app.get("/getUniswap", async function (req, res, next) {
    let times = parseInt(req.query.times);
    times=10;
    let sql = "select * , FROM_UNIXTIME(timestamp,'%m-%d %H:%i') as time  from (select *  from uniswap order by id desc limit ? ) a order by id";
    let ret =await query(sql,[times,times],function(err,vals,fields){});
    var prices = [];
    let minPrice = 999999;
    let maxPrice = 0;
    for (let index = 0; index < ret.length; index++) {
        //console.log(ret[index].price);
        prices.push({ value: ret[index].price, dateTime: ret[index].time });
        if (ret[index].price < minPrice) { minPrice = ret[index].price; }
        if (ret[index].price > maxPrice) { maxPrice = ret[index].price; }
    }
    let legendList = ['MNT Price'];
    let xAxisList = [];
    for (let index = times; index > 0; index--) {
        xAxisList.push(index);
    }
    var seriesList = [{
        name: 'MNT Price',
        data: prices
    }]
    var charts = {
        xAxis: xAxisList,
        legend: legendList,
        series: seriesList,
        minPrice: minPrice,
        maxPrice: maxPrice,

    }
    res.send(charts);
  })

 
  

/*
if (ret1.tx_hex == transaction.serialization.substring(0, ret1.tx_hex.length)) {
    console.log("tx_hex OK");
} else {
    console.log("tx_hex err");
}
*/




const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})



let server = app.listen(7711, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('http://%s:%s', host, port);
  });