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

const g_frok = '000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c7';

app.use(express.static(__dirname + '/static', {index: 'help.html'}));
app.use(bodyParser.json());

browser.Load(app,conn);

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

function chain_method(method,params) {
  return new Promise(fun => {
    request({
        url: url,
        method: 'POST',
        json: true,
        body:{'id':1,'method' : method,'jsonrpc':'2.0','params' : params}},
      function(error, response, body) {
        if (body.error) {
          return;
        } else {
          fun(body.result);
        }
      });
  });  
}

// http://127.0.0.1:7711/quotations
app.get('/quotations', async function(req, res, next) {
  console.log('quotations');
  let sql = 'SELECT tradePairId,price,`precision`,price24h FROM quotations';
  let ret = await query(sql,[req.query.walletId]);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

app.get('/banners', async function(req, res, next) {
  console.log('banners');
  let sql = 'SELECT * FROM banners';
  let ret = await query(sql,[req.query.walletId]);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

app.post('/register', async function(req, res, next) {

  let hah_addr = '';
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
        hah_addr = req.body.params.wallet[n].address;
        break;
    }
  }
  let walletId = req.body.params.hash;
  let sql = 'select * from addr where walletId = ?';
  let result = await query(sql,[walletId]);
  if (result.length == 0) {
    let pub = utils.Addr2Hex(hah_addr);
    pub = pub.subarray(1);
    pub.reverse();
    await hah_method('importpubkey',{'pubkey': pub.toString('hex')});
    sql = 'insert into addr(walletId,hah_addr,eth_addr,btc_addr)values(?,?,?,?)';
    await query(sql,[walletId,hah_addr,eth_addr,btc_addr]);
    console.log('register','Add');
    res.json({'status':'add'});
  } else {
    console.log('register','OK');
    res.json({'status':'OK'});
  }
});


app.get('/balance', async function(req, res, next) {
  //http://127.0.0.1:7711/balance?address=1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58&symbol=BBC
  //77f2b1217377f62cbb34c5b72b63c6c17fdb5e9e0b6173b4edcb19d03922c0f5
  //res.json({'address': req.query.address,'symbol': req.query.symbol});
  console.log('balance',req.query.symbol);
  if (req.query.symbol == 'MNT') {
    let ret = await chain_method('getbalance',{'address':req.query.address});
    let json = {'unconfirmed': parseFloat(ret[0].unconfirmedin) - parseFloat(ret[0].unconfirmedout),'balance': parseFloat(ret[0].avail)};
    console.log(json);
    res.json(json);
  } else {
    res.json({'unconfirmed': 0,'balance': 0});
  }
});

// http://127.0.0.1:7711/transaction?address=1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58&symbol=BBC
app.get('/transaction', async function(req, res, next) {
  console.log('transaction',req.query.address);
  let sql = "select txid as `hash`,`from` as fromAddress,`to` as toAddress,transtime as `timestamp`,1 as confirmed,fee as txFee, amount from tx \
          where (`to` = ?) or (`from` = ?) order by id desc limit 10";
  let ret = await query(sql,[req.query.address,req.query.address]);
  let dataString = JSON.stringify(ret);
  res.json(JSON.parse(dataString));
});

// 得到交易信息
app.get('/fee', async function(req, res, next) {
  console.log('fee',req.query.address);
  let ret = await chain_method('getbalance',{'address':req.query.address});
  let json = {'nonce' : parseFloat(ret[0].nonce),'gas_price': 10000,'gas_limit': 10000};
  res.json(json);
});


app.post('/createtransaction', function(req, res, next) {
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
  let ret = lib.GetTx(ts,fork,nonce,from,to,amount,gasPrice,gasLimit,data);
  res.json(ret);
});

app.post('/GetVote', function(req, res, next) {
  let delegate = req.body.delegate;
  let owner = req.body.owner;
  let rewardmode = req.body.rewardmode;
  let ret = lib.GetVote(delegate,owner,rewardmode);
  res.json(ret);
});

let server = app.listen(7711, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('http://%s:%s', host, port);
});