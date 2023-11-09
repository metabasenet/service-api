import { ethers } from 'ethers'
import fs from 'fs'
import mysql from 'mysql'
import config from '../config/config.js'
import moment from 'moment'

const connection = mysql.createConnection(config.database)

const erc20_abi = JSON.parse(fs.readFileSync('./erc20.json', 'utf8'));
const rpc = 'http://127.0.0.1:7545'
//const rpc = 'https://rpc.metabasenet.site'

const provider = new ethers.JsonRpcProvider(rpc)
const usdt_addr = '0xe03d4d96678657E680b9628c8fbA8F445c91e83a'
const usdt = new ethers.Contract(usdt_addr, erc20_abi, provider)

const coder = ethers.AbiCoder.defaultAbiCoder()

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

/*
function subscribe() {
    usdt.on('Transfer', async (from, to, value, event) => {
        const txid = event.transactionHash;
        const txid_index = event.transactionIndex
        value = ethers.formatEther(value)
        console.log(from, to, value)
        await query('call add_transfer(?,?,?,?,?,?)', [txid, txid_index, from, to, value, usdt_addr])
    })
}
*/

async function sync(bn0, bn1) {
    const transfer_logs = await usdt.queryFilter(usdt.filters.Transfer(), bn0, bn1)
    for (let i = 0; i < transfer_logs.length; i++) {
        const log = transfer_logs[i]
        const txid = log.transactionHash;
        const index = log.index
        const from = coder.decode(['address'], log.topics[1])[0]
        const to = coder.decode(['address'], log.topics[2])[0]
        const value = ethers.formatEther(coder.decode(['uint256'], log.data)[0])
        const utc = (await provider.getBlock(log.blockNumber)).timestamp
        console.log(from, to, value)
        await query('call add_transfer(?,?,?,?,?,?,?)', [txid, index, from, to, value, usdt_addr, utc])
    }
}

async function task() {
    const data = await query("SELECT `hash` FROM erc20transfer where erc20_addr = ? order by id desc limit 1", [usdt_addr])
    //console.log(config.wgt_addr)
    let bn = 0;
    if (data.length > 0) {
        const ret = await provider.getTransactionReceipt(data[0].hash)
        bn = ret.blockNumber
    }

    while (true) {
        const bn1 = await provider.getBlockNumber()
        if (bn1 > bn + 5000) {
            await sync(bn, bn + 5000)
            bn = bn + 5000
            console.log(bn)
        } else {
            //console.log('subscribe...')
            //subscribe()
            await sync(bn, 'latest')
            console.log('latest')
            break
        }
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

while (true) {
    await task();
    await sleep(1000 * 5);
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log('sleep 5s ...', time);
}