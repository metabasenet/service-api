import Router from 'koa-router'
import { query, provider } from '../lib.js'

const router = Router()

router.get('/list/:addr/:id/:t', async (ctx, next) => {
    const addr = ctx.params.addr
    const id = ctx.params.id
    let sql = ''
    if (ctx.params.t == '0') {
        //getNext
        sql = 'SELECT id,`hash`, `from`,`to`,`value`,method FROM tx where (`from` = ? or `to` = ?) and id < ? order by id desc limit 12'
    } else {
        //getUp
        sql = 'SELECT id,`hash`, `from`,`to`,`value`,method FROM tx where (`from` = ? or `to` = ?) and id > ? order by id asc limit 12'
    }
    const ret = await query(sql, [addr.toLowerCase(), addr.toLowerCase(), id])
    ctx.body = ret
})

router.get('/:addr', async (ctx, next) => {
    const addr = ctx.params.addr
    const ret = await provider.getBalance(addr)
    ctx.body = { balance: ret.toString() }
})

export default router