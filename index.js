const express = require('express');
const bodyParser = require('body-parser')
const mysql = require('mysql');
const request = require('request')
const lib = require('./lib.js')
const browser = require('./browser.js')
const app = express();

const url = 'http://127.0.0.1:8812';
const conn = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'mnt',
  password: '1234qwer',
  database: 'mnt'
});


app.use(express.static(__dirname + '/static', { index: 'help.html' }));
app.use(bodyParser.json());

browser.Load(app, conn);

const g_frok = '000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c7';

function query(sql, params) {
  return new Promise(fun => {
    conn.query(sql, params, function (err, result) {
      if (err) {
        return;
      }
      fun(result);
    });
  });
};

function chain_method(method, params) {
  return new Promise(fun => {
    request({
      url: url,
      method: 'POST',
      json: true,
      body: { 'id': 1, 'method': method, 'jsonrpc': '2.0', 'params': params }
    },
      function (error, response, body) {
        if (body.error) {
          return;
        } else {
          fun(body.result);
        }
      });
  });
}

// http://127.0.0.1:7711/quotations
app.get('/quotations', async function (req, res, next) {
  console.log('quotations');
  let sql = 'SELECT tradePairId,price,`precision`,price24h FROM quotations';
  let ret = await query(sql, [req.query.walletId]);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

app.get('/banners', async function (req, res, next) {
  console.log('banners');
  let sql = 'SELECT * FROM banners';
  let ret = await query(sql, [req.query.walletId]);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

app.post('/register', async function (req, res, next) {

  let mnt_addr = '';
  let eth_addr = '';
  let btc_addr = '';
  for (let n = 0; n < req.body.params.wallet.length; n++) {
    switch (req.body.params.wallet[n].chain) {
      case 'BTC':
        btc_addr = req.body.params.wallet[n].address;
        break;
      case 'ETH':
        eth_addr = req.body.params.wallet[n].address;
        break;
      case 'BBC':
        mnt_addr = req.body.params.wallet[n].address;
        break;
    }
  }
  let walletId = req.body.params.hash;
  let sql = 'select * from addr where walletId = ?';
  let result = await query(sql, [walletId]);
  if (result.length == 0) {
    let pub = utils.Addr2Hex(mnt_addr);
    pub = pub.subarray(1);
    pub.reverse();
    await mnt_method('importpubkey', { 'pubkey': pub.toString('hex') });
    sql = 'insert into addr(walletId,mnt_addr,eth_addr,btc_addr)values(?,?,?,?)';
    await query(sql, [walletId, mnt_addr, eth_addr, btc_addr]);
    console.log('register', 'Add');
    res.json({ 'status': 'add' });
  } else {
    console.log('register', 'OK');
    res.json({ 'status': 'OK' });
  }
});


app.get('/balance', async function (req, res, next) {
  //http://127.0.0.1:7711/balance?address=1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58&symbol=BBC
  //77f2b1217377f62cbb34c5b72b63c6c17fdb5e9e0b6173b4edcb19d03922c0f5
  //res.json({'address': req.query.address,'symbol': req.query.symbol});
  console.log('balance', req.query.symbol);
  if (req.query.symbol == 'MNT') {
    let ret = await chain_method('getbalance', { 'address': req.query.address });
    let json = { 'unconfirmed': parseFloat(ret[0].unconfirmedin) - parseFloat(ret[0].unconfirmedout), 'balance': parseFloat(ret[0].avail) };
    console.log(json);
    res.json(json);
  } else {
    res.json({ 'unconfirmed': 0, 'balance': 0 });
  }
});

// http://127.0.0.1:7711/transaction?address=1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58&symbol=BBC
app.get('/transaction', async function (req, res, next) {
  console.log('transaction', req.query.address);
  let sql = "select txid as `hash`,`from` as fromAddress,`to` as toAddress,transtime as `timestamp`,1 as confirmed,fee as txFee, amount from tx \
          where (`to` = ?) or (`from` = ?) order by id desc limit 10";
  let ret = await query(sql, [req.query.address, req.query.address]);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

// 得到交易信息
app.get('/fee', async function (req, res, next) {
  console.log('fee', req.query.address);
  let ret = await chain_method('getbalance', { 'address': req.query.address });
  let json = { 'nonce': parseFloat(ret[0].nonce), 'gas_price': 10000, 'gas_limit': 10000 };
  res.json(json);
});

app.get('/sendtransaction', async function(req, res, next) {
  console.log('sendtransaction',req.query.hex);
  let ret = await chain_method('sendtransaction',{'txdata': req.query.hex});
  res.send(ret);
});

app.post('/createtransaction', function (req, res, next) {
  let ts = req.body.time;
  let fork = req.body.fork;
  if (fork == undefined) {
    fork = g_frok;
  }
  let nonce = req.body.nonce;
  let from = req.body.from;
  let to = req.body.to;
  let amount = req.body.amount;
  let gasPrice = req.body.gasprice;
  if (gasPrice == undefined) {
    gasPrice = "0.0000010000";
  }
  let gasLimit = req.body.gaslimit;
  if (gasLimit == undefined) {
    gasLimit = 10000;
  }
  let data = req.body.data;
  if (data == undefined) {
    data = '00';
  }
  let ret = lib.GetTx(ts, fork, nonce, from, to, amount, gasPrice, gasLimit, data);
  res.json(ret);
});

app.post('/GetVote', function (req, res, next) {
  let delegate = req.body.delegate;
  let owner = req.body.owner;
  let rewardmode = req.body.rewardmode;
  let ret = lib.GetVote(delegate, owner, rewardmode);
  res.json(ret);
});

app.get('/listdelegate', async function (req, res, next) {
  console.log('listdelegate');
  let sql = "SELECT address,votes,`name` FROM pool";
  let ret = await query(sql, []);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

app.get('/listdelegatedetail', async function (req, res, next) {
  console.log('listdelegatedetail');
  let count = 0;
  let pagenum = req.query.page;
  let pagesize = req.query.pagesize;
  let sql_count="select count(*) as count from (select client_in as client_address, format(amount,4) as amount,  FROM_UNIXTIME(transtime,'%Y-%m-%d %H:%i:%s') as time , \
                 height , 'vote' as voteState from tx where  dpos_in =?  union all   select client_out as client_address, format(amount,4) as amount,  \
                 FROM_UNIXTIME(transtime,'%Y-%m-%d %H:%i:%s') as time , height , 'withdrawal' as voteState from tx where  dpos_out =?)a";
  let ret_count = await query(sql_count,  [req.query.dposAddress, req.query.dposAddress]);
  var jsonCount= JSON.parse(JSON.stringify(ret_count[0]));
  count=Number(jsonCount["count"]);  
  let sql = "select * from (select client_in as client_address, format(amount,4) as amount,  FROM_UNIXTIME(transtime,'%Y-%m-%d %H:%i:%s') as time , \
              height , 'vote' as voteState from tx where  dpos_in =?  union all   select client_out as client_address, format(amount,4) as amount,  \
              FROM_UNIXTIME(transtime,'%Y-%m-%d %H:%i:%s') as time , height , 'withdrawal' as voteState from tx where  dpos_out =? \
              )a order by height  limit " + (pagenum-1)*pagesize + "," + pagesize;

  let ret = await query(sql,  [req.query.dposAddress, req.query.dposAddress]);
  let dataString = JSON.parse(JSON.stringify(ret));
  var txdata = {
    total : count,
    pagenum : pagenum,
    pagesize : pagesize,
    data:dataString
  }; 
  res.json(txdata);
});
app.get('/blockstatistics', async function(req,res,next){
  //let xAxisSql="select group_concat(concat('\\'',reward_date, '\\'')) as reward_date from (select distinct reward_date from blockstatistics where datediff(now(),str_to_date(reward_date,'%Y-%m-%d') ) < 31 order by reward_date)a";
  let xAxisSql="select reward_date from (select distinct reward_date from blockstatistics where datediff(now(),str_to_date(reward_date,'%Y-%m-%d') ) < ? order by reward_date)a";
  let xAxisRet = await query(xAxisSql,  [req.query.days]); 
  xAxisRet = JSON.parse(JSON.stringify(xAxisRet));
  let xAxisList=[];
  for (let xAxisIndex =0;xAxisIndex < xAxisRet.length;xAxisIndex++){
    xAxisList.push(xAxisRet[xAxisIndex].reward_date.slice(5));
  }

  let legendSql="SELECT a.reward_address, pool.name FROM (SELECT DISTINCT reward_address FROM blockstatistics WHERE DATEDIFF(NOW(), STR_TO_DATE(reward_date, '%Y-%m-%d')) < ? \
                ORDER BY reward_address) a  LEFT JOIN pool ON pool.address = a.reward_address";
  let legendRet= await  query(legendSql, [req.query.days]);
  legendRet= JSON.parse(JSON.stringify(legendRet));
  let legendList=[];
  let seriesList=[];
  for(let legendIndex =0; legendIndex< legendRet.length;legendIndex++){
    let legend=legendRet[legendIndex].reward_address;
    console.log(legend);
    legendList.push(legendRet[legendIndex].name);
    let amountSql="select a.reward_date,case when amount is null then 0 else amount end amount  from ( \
      select distinct reward_date from blockstatistics where datediff(now(),str_to_date(reward_date,'%Y-%m-%d') ) < ? ) a \
      left join blockstatistics on str_to_date(blockstatistics.reward_date,'%Y-%m-%d')= a.reward_date \
      and blockstatistics.reward_address =?     order by a.reward_date";
    let amountRet=await query(amountSql, [req.query.days,legend]);
    amountRet=JSON.parse(JSON.stringify(amountRet));
    let amountList=[];
    for(let amountIndex =0; amountIndex <amountRet.length; amountIndex++ ){
      amountList.push(amountRet[amountIndex].amount);
    }
    let nameSql="select name from pool where address =?";
    let nameRet=await query(nameSql,[legend]);
    nameRet=JSON.parse(JSON.stringify(nameRet));
    if (nameRet.length == 1){
      legend=nameRet[0].name;
    }
    var serie={
      name:legend,
      data:amountList,
    }
    seriesList.push(serie);
  }


  var charts={
    xAxis:xAxisList,
    legend:legendList,
    series:seriesList

  }
  res.send(charts);
});

let server = app.listen(7711, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log('http://%s:%s', host, port);
});