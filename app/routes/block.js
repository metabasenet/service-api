import Router from 'koa-router'
//import { file_failure, error_address, error_id } from './message.js'
import { query, provider } from '../lib.js'
//import { isValidSignature, fromRpcSig } from 'ethereumjs-util'

const router = Router()

router.get('/new', async (ctx, next) => {
    const ret = await query('SELECT `number`,`hash`,`timestamp`,txns,reward FROM `block` order by `number` desc limit 12', [])
    ctx.body = ret
})

router.get('/total', async (ctx, next) => {
    const ret = await query('SELECT max(`number`) as total FROM `block`', [])
    ctx.body = ret[0]
})

router.get('/list/:number', async (ctx, next) => {
    const number = ctx.params.number
    const ret = await query('SELECT `number`,`hash`,`timestamp`,txns,reward FROM `block` where `number` < ? order by `number` desc limit 12', [number])
    ctx.body = ret
})

router.get('/:id', async (ctx, next) => {
    const id = ctx.params.id
    ctx.body = await provider.getBlock(id)
    //const ret = await query('SELECT `number`,`hash`,`timestamp`,txns,reward FROM `block` where `number` < ? order by `number` desc limit 12', [number])
    //ctx.body = id
})

export default router