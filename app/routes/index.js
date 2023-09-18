import Router from 'koa-router'

import block from './block.js'
import tx from './tx.js'
const router = Router()

router.use('/block', block.routes(), block.allowedMethods())
router.use('/tx', tx.routes(), tx.allowedMethods())

export default router
