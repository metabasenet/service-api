import Router from 'koa-router'
//import { isAddress } from 'ethers'
//import { file_failure, error_address, error_id } from './message.js'
import { query } from '../lib.js'
//import { isValidSignature, fromRpcSig } from 'ethereumjs-util'

const router = Router()

router.get('/new', async (ctx, next) => {
    const ret = await query('SELECT `number`,`hash`,`timestamp`,txns,reward FROM `block` order by `number` desc limit 12', [])
    ctx.body = ret
})

export default router