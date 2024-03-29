import mysql from 'mysql'
import moment from 'moment'
import config from '../config/config.js'
import { ethers } from 'ethers'

let connection = mysql.createConnection(config.database)

function ReConnecting() {
    connection.on('error', (err) => {
        console.log('Re-connecting lost connection: ', err)
        connection = mysql.createConnection(config.database)
        ReConnecting()
    })
}

ReConnecting()

let c = 0
setInterval(async () => {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    c = c + 1;
    const sql = `select ${c} as A`;
    const ret = await query(sql, []);
    console.log(time, ret[0]);
}, 1800 * 1000)

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545')

export { query, sleep, provider }