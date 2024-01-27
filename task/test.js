import { ethers } from 'ethers';
import moment from 'moment';
import mysql from 'mysql';
import config from '../config/config.js';

const connection = mysql.createConnection(config.database);
const rpc = 'http://127.0.0.1:7545';
//const rpc = 'https://rpc.metabasenet.site'

function query(sql, params) {
  return new Promise(fun => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        fun(err)
        return
      }
      fun(result)
    })
  })
}

const provider = new ethers.JsonRpcProvider(rpc);

const rows1 = await query('SELECT DISTINCT `from` as A FROM `mnt-scan`.erc20transfer');
for (let i = 0; i < rows1.length; i++) {
  console.log('1',rows1[i].A);
}


const rows2 = await query('SELECT DISTINCT `to` as A FROM `mnt-scan`.erc20transfer');
for (let i = 0; i < rows2.length; i++) {
  console.log('2',rows2[i].A);
}
//const transactionHash = '0x506ce432f1a3795aaae75c83fdbb688ee9e91c92519ab6819808c456d879c362';
//const transactionHash = '0x638b295cab62dd09356d36ed7be01cf8ef27f2b74e6a4fc80d5f991f6700cc69';
//const result = await provider.send('debug_traceTransaction', [transactionHash]);
//console.log('指令长度', result.structLogs.length);
//console.log('历史块高', (await provider.getTransactionReceipt(transactionHash)).blockNumber);
//console.log('当前块高', await provider.getBlockNumber());

