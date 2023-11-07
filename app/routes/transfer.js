import Router from 'koa-router'
import { query } from '../lib.js'
//import moment from 'moment'

const router = Router()

router.get('/usdt/:addr', async (ctx, next) => {
    const addr = ctx.params.addr
    const ret = await query("SELECT `hash`,`from`,`to`,`value`,`utc` FROM erc20transfer where erc20_addr = '0xe03d4d96678657E680b9628c8fbA8F445c91e83a' and (`from` = ?  or `to` = ?) order by id desc limit 40", [addr,addr])
    ctx.body = ret
})

router.get('/mnt/:addr', async (ctx, next) => {
    const addr = ctx.params.addr
    const ret = await query("SELECT `hash`,`from`,`to`,`value`,`utc` FROM erc20transfer where erc20_addr = '' and (`from` = ?  or `to` = ?) order by id desc limit 40", [addr,addr])
    ctx.body = ret
})

export default router