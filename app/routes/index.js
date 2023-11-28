import Router from 'koa-router';

import block from './block.js';
import tx from './tx.js';
import address from './address.js';
import nodes from './nodes.js';
import transfer from './transfer.js';
import dapp1 from './dapp1.js';

const router = Router();

router.use('/block', block.routes(), block.allowedMethods());
router.use('/tx', tx.routes(), tx.allowedMethods());
router.use('/address', address.routes(), address.allowedMethods());
router.use('/nodes', nodes.routes(), nodes.allowedMethods());
router.use('/transfer', transfer.routes(), transfer.allowedMethods());
router.use('/dapp1', dapp1.routes(), dapp1.allowedMethods());

export default router;
