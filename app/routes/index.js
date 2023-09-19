import Router from 'koa-router'

import block from './block.js'
import tx from './tx.js'
import address from './address.js'

const router = Router()

router.use('/block', block.routes(), block.allowedMethods())
router.use('/tx', tx.routes(), tx.allowedMethods())
router.use('/address', address.routes(), address.allowedMethods())

export default router
