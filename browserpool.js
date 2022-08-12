function Load(app,querypool) {
    app.post('/rank',function(req,res,next) {
      let params = [];
      let count = 0;
      let pagenum = req.body.page;
      let pagesize = req.body.pagesize;

      let sql_count = 'select count(*) as count from `rank`';
      querypool(sql_count, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        count = result[0].count;
        if(count){
          let sql = 'select * from `rank` order by ranking asc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          querypool(sql, params, function(err, result) {
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
      let sql = 'select `block`.* , (case when  `pool`.`name` is not null  then `pool`.`name` else `block`.reward_address end) as dposName from `block` left join `pool` on `block`.reward_address = `pool`.address  where  is_useful = 1 order by id desc limit 15';
      let params = [];
      querypool(sql, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        let dataString = JSON.stringify(result);
        res.send(JSON.parse(dataString));
      });
    });

    app.get('/newtx/', function(req, res, next) {
      let sql = 'select * from tx order by id desc limit 15';
      let params = [];
      querypool(sql, params, function(err, result) {
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
      console.log('pagenum',pagenum);
      let sql_count = 'select count(*) as count from block where is_useful = 1';
      querypool(sql_count, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        count = result[0].count;
        if(count){
          let sql = 'select `block`.* , (case when  `pool`.`name` is not null  then `pool`.`name` else `block`.reward_address end) as dposName from `block` left join `pool` on `block`.reward_address = `pool`.address  where is_useful = 1 order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          querypool(sql, params, function(err, result) {
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

      let sql_count = 'select count(*) as count from tx';
      if(block_hash){
        params = [block_hash];
        sql_count = 'select count(*) as count from tx where block_hash=?';
      }
      querypool(sql_count, params, function(err, result) {
        if (err) {
          res.json({'error': err});
          return;
        }
        count = result[0].count;
        if(count){
          let sql = 'select * from tx  order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          if(block_hash){
            params = [block_hash];
            sql = 'select * from tx where block_hash=? order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          }
          querypool(sql, params, function(err, result) {
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
      let sql = 'select * from block where hash = ?';
      if (param.length < 64) {
        sql = 'select * from block where height = ?';
      }
      let params = [param];
      var jsonData = {}
      querypool(sql, params, function(err, result) {
        let dataString = JSON.stringify(result);
        res.send(JSON.parse(dataString));
      });
    });

    app.post('/tx/', function(req, res, next) {
      let txid = req.body.txid;
      let params = [txid];
      let sql = 'select * from tx where txid = ?';
      querypool(sql, params, function(err, result) {
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
      let isql = 'select sum(amount) as income from tx where `to` = ?';
      //支出
      let esql = 'select sum(amount) as expend from tx where `from` = ?';
      //排行
      let sql = 'SELECT ranking from `rank` where address=?';

      let jsonData = {
        balance:0,
        income:0,
        expend:0,
        rank:0,
        data:{}
      }

      querypool(isql, param, function(err, result) {
        try{
          jsonData.income = result[0].income;
        }catch{}
      });
      querypool(esql, param, function(err, result) {
        try{
          jsonData.expend = result[0].expend;
          }catch{}
      });
      querypool(sql, param, function(err, result) {
        try{
          jsonData.rank = result[0].ranking;

        }catch{}
      });


      let sql_count = 'select count(*) as count from `tx` where `from`=? or `to`=?';
      querypool(sql_count, params, function(err, result) {
        count = result[0].count;
        if(count){
          let sql = 'select * from `tx` where `from`=? or `to`=? order by id desc limit ' + (pagenum-1)*pagesize + "," + pagesize;
          querypool(sql, params, function(err, result) {
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