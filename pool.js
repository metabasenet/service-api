const mysql = require('mysql');

const config ={     
    host     : '127.0.0.1',       
    user     : 'mnt',              
    password : '1234qwer',       
    port: '3306',                   
    database: 'mnt',
    connectionLimit: 50, //
    queueLimit: 3 //
}

var pool = mysql.createPool(config);
var querypool = function (sql, params, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, params,function (qerr, vals, fields) {
                callback(qerr, vals, fields);
                conn.release();
            });
        }
    });
};
  
module.exports=querypool;   