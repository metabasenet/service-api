import mysql from 'mysql'
import moment from 'moment'
import config from '../config/config.js'

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
setInterval(async ()=> {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    c = c + 1
    const sql = `select max(id) as id, ${c} as A from friends`
    const ret = await query(sql,[])
    console.log(time,ret[0])
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

export { query, sleep }