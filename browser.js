function Load(app,conn) {
    app.post('/rank',function(req,res,next) {
      let params = [];
      let count = 0;
      let pagenum = req.body.page;
      let pagesize = req.body.pagesize;

      let sql_count = 'select count(*) as count from Rank';
      conn.query(sql_count, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        count = result[0].count;
        if(count){
          let sql = 'select * from Rank order by ranking asc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          conn.query(sql, params, function(err, result) {
              var jsonData = {
                  total : count,
                  pagenum : pagenum,
                  pagesize : pagesize,
                  data:result
                };  
              res.send(jsonData);
          });
        }
      });
    });
    
    app.get('/newblock/', function(req, res, next) {
      let sql = 'select * from Block where is_useful = 1 order by id desc limit 15';
      let params = [];
      conn.query(sql, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        let dataString = JSON.stringify(result);
        res.send(JSON.parse(dataString));
      });
    });

    app.get('/newtx/', function(req, res, next) {
      let sql = 'select * from Tx order by id desc limit 15';
      let params = [];
      conn.query(sql, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        let dataString = JSON.stringify(result);
        res.send(JSON.parse(dataString));
      });
    });

    app.post('/blocklist/', function(req, res, next) {
      let params = [];
      let count = 0;
      let pagenum = req.body.page;
      let pagesize = req.body.pagesize;

      let sql_count = 'select count(*) as count from Block where is_useful = 1';
      conn.query(sql_count, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        count = result[0].count;
        if(count){
          let sql = 'select * from Block where is_useful = 1 order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          conn.query(sql, params, function(err, result) {
              var jsonData = {
                  total : count,
                  pagenum : pagenum,
                  pagesize : pagesize,
                  data:result
                };  
              res.send(jsonData);
          });
        }
      });
    });

    app.post('/txlist/', function(req, res, next) {
      var params = [];
      let count = 0;
      let pagenum = req.body.page;
      let pagesize = req.body.pagesize;
      let block_hash = req.body.block_hash;

      let sql_count = 'select count(*) as count from Tx';
      if(block_hash){
        params = [block_hash];
        sql_count = 'select count(*) as count from Tx where block_hash=?';
      }
      conn.query(sql_count, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        count = result[0].count;
        if(count){
          let sql = 'select * from Tx  order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          if(block_hash){
            params = [block_hash];
            sql = 'select * from Tx where block_hash=? order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          }
          conn.query(sql, params, function(err, result) {
              var jsonData = {
                  total : count,
                  pagenum : pagenum,
                  pagesize : pagesize,
                  data:result
                };  
              res.send(jsonData);
          });
        }
      });
    });

    app.post('/block/', function(req, res, next) {
      let param = req.body.param;
      let sql = 'select * from Block where hash = ?';
      if (param.length < 64) {
        sql = 'select * from Block where height = ?';
      }
      let params = [param];
      var jsonData = {}
      conn.query(sql, params, function(err, result) {
        let dataString = JSON.stringify(result);
        res.send(JSON.parse(dataString));
      });
    });

    app.post('/tx/', function(req, res, next) {
      let txid = req.body.txid;
      let params = [txid];
      let sql = 'select * from Tx where txid = ?';
      conn.query(sql, params, function(err, result) {
          let dataString = JSON.stringify(result);
          res.send(JSON.parse(dataString));
      });
    });
  
    app.post('/address/', function(req, res, next) {
      let address = req.body.address;
      var count = 0;
      var pagenum = req.body.page;
      var pagesize = req.body.pagesize;

      //let address = '20m05he4extaq0190revg19qa2mjjb4dbb54w7cd2q1vvmb2waptt2cc7';
      let param = [address];
      let params = [address,address];
      //余额 = 收入 - 支出
      //收入
      let isql = 'select sum(amount) as income from Tx where `to` = ?';
      //支出
      let esql = 'select sum(amount) as expend from Tx where `from` = ?';
      //排行
      let sql = 'SELECT ranking from Rank where address=?';

      let jsonData = {
        balance:0,
        income:0,
        expend:0,
        rank:0,
        data:{}
      }

      conn.query(isql, param, function(err, result) {
        try{
          jsonData.income = result[0].income;
        }catch{}
      });
      conn.query(esql, param, function(err, result) {
        try{
          jsonData.expend = result[0].expend;
          }catch{}
      });
      conn.query(sql, param, function(err, result) {
        try{
          jsonData.rank = result[0].ranking;

        }catch{}
      });


      let sql_count = 'select count(*) as count from `Tx` where `from`=? or `to`=?';
      conn.query(sql_count, params, function(err, result) {
        count = result[0].count;
        if(count){
          let sql = 'select * from `Tx` where `from`=? or `to`=? order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          conn.query(sql, params, function(err, result) {
              var txdata = {
                  total : count,
                  pagenum : pagenum,
                  pagesize : pagesize,
                  data:result
                }; 

              jsonData.data = txdata;
              jsonData.balance = Number(jsonData.income) - Number(jsonData.expend)

              res.send(jsonData);
          });
        }
      });
    });

    function check_mn(m,n){
      let regPos = /^\d+$/;
      if (regPos.test(m) && regPos.test(n)) {
        if (n - m <= 20) {
          return true;
        } 
      }
      return false;
    }

}

module.exports = {
  Load: Load
};