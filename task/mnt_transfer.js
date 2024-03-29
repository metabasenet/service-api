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

async function Transaction(transactionHash) {
  const ret = await provider.getTransactionReceipt(transactionHash);

  if (ret.status == 1) {
    const from = ret.to
    const tx = await provider.getTransaction(transactionHash);
    const utc = (await provider.getBlock(ret.blockNumber)).timestamp;
    if (tx.value > 0n) {
    
      if (ethers.isAddress(ret.from)) {
        const f_b = ethers.formatEther(await provider.getBalance(ret.from));
        await query('call mnt_b(?,?)',[ret.from,f_b]);
      }
      if (ethers.isAddress(ret.to)) {
        const t_b = ethers.formatEther(await provider.getBalance(ret.to));
        await query('call mnt_b(?,?)',[ret.to,t_b]);
      }
      await query('call add_transfer(?,?,?,?,?,?,?)', [transactionHash, -1, ret.from, ret.to, ethers.formatEther(tx.value), '', utc])
    }

    const result = await provider.send('debug_traceTransaction', [transactionHash]);
    for (let i = 0; i < result.structLogs.length; i++) {
      if (result.structLogs[i].op == 'CALL') {
        const l = result.structLogs[i].stack.length;
        // gas 额度
        const gas = result.structLogs[i].stack[l - 1];
        const to = result.structLogs[i].stack[l - 2];
        const value = ethers.formatEther(result.structLogs[i].stack[l - 3]);
        const in_size = result.structLogs[i].stack[l - 5];
        //console.log(gas, to, value, in_size);
        if (ethers.isAddress(from)) {
          const f_b = ethers.formatEther(await provider.getBalance(from));
          await query('call mnt_b(?,?)',[from,f_b]);
        }
        if (ethers.isAddress(to)) {
          const t_b = ethers.formatEther(await provider.getBalance(to));
          await query('call mnt_b(?,?)',[to,t_b]);
        }
        if (in_size == 0) {
          console.log(value, to);
          await query('call add_transfer(?,?,?,?,?,?,?)', [transactionHash, i, from, to, value, '',utc])
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

while (true) {
  const h = await provider.getBlockNumber()
  const txs = await query('select id,`hash` from tx where state is null and number > ? limit 100',[h - 128])
  for (let i = 0; i < txs.length; i++) {
    console.log(txs[i].hash,txs[i].id)
    await Transaction(txs[i].hash)
    await query('update tx set state = 1 where id = ?',[txs[i].id])
  }
  await sleep(1000 * 5)
  const time = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log('sleep 5s ...', time)
}

//Transaction('0x47cfa9d7806cb2c6af884e25604ad95d23524082be94f2acf69507015659cbe5')
