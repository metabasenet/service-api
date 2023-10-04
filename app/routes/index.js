import Router from 'koa-router'

import block from './block.js'
import tx from './tx.js'
import address from './address.js'
import nodes from './nodes.js'

const router = Router()

router.use('/block', block.routes(), block.allowedMethods())
router.use('/tx', tx.routes(), tx.allowedMethods())
router.use('/address', address.routes(), address.allowedMethods())
router.use('/nodes', nodes.routes(), nodes.allowedMethods())


export default router
