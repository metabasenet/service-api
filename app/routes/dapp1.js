import Router from 'koa-router'
import { query } from '../lib.js'

const router = Router()

router.get('/tx/:addr/:bn', async (ctx, next) => {
    const addr = ctx.params.addr
    const bn = ctx.params.bn
    const ret = await query('SELECT `number` as bn, `hash` as txid FROM tx where `number` >= ? and `to` = ? limit 10', [bn,addr]);
    ctx.body = ret
})

export default router