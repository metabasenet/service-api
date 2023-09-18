import Router from 'koa-router'
import { query } from '../lib.js'
import moment from 'moment'

const router = Router()

router.get('/new', async (ctx, next) => {
    const ret = await query('SELECT tx.`hash`,tx.`from`,tx.`to`,`block`.`timestamp` FROM tx inner join `block` on `block`.`number` = tx.`number` order by tx.id desc limit 12', [])
    ctx.body = ret
})

router.get('/total', async (ctx, next) => {
    const ret = await query('SELECT max(tx.`id`) as total FROM tx', [])
    ctx.body = ret[0]
})


router.get('/:id', async (ctx, next) => {
    const id = ctx.params.id
    const ret = await query('SELECT tx.`id`, tx.`hash`,tx.`from`,tx.`to`,`block`.`timestamp` FROM tx inner join `block` on `block`.`number` = tx.`number` where tx.`id` < ? order by tx.id desc limit 12', [id])
    ctx.body = ret
})

export default router