import Router from 'koa-router'
//import { file_failure, error_address, error_id } from './message.js'
import { query, provider } from '../lib.js'
//import { isValidSignature, fromRpcSig } from 'ethereumjs-util'

const router = Router()

router.get('/list', async (ctx, next) => {
    const sql = 'select nodes.addr,nodes.`name`,nodes.state, ifnull(A.s,0) as s from mnt.nodes left join (SELECT addr,sum(value) as s FROM mnt.logs where type = 2 group by addr) A on A.addr = nodes.addr'
    const ret = await query(sql, [])
    ctx.body = ret
})

router.get('/:addr', async (ctx, next) => {
    const addr = ctx.params.addr
    ctx.body = 111 // await provider.getBlock(id)
    //const ret = await query('SELECT `number`,`hash`,`timestamp`,txns,reward FROM `block` where `number` < ? order by `number` desc limit 12', [number])
    //ctx.body = id
})

export default router