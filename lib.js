const utils = require('./utils.js')
const bignum = require('bignum');
const blake = require('blakejs')

function LenHex(n) {
	if (n < 0xFD) {
		return Buffer.from([n]);
	} else if (n <= 0xFFFF) {
		const buf_n = Buffer.allocUnsafe(2);
    	buf_n.writeUInt16LE(n);
		return Buffer.from([0xfd,buf_n[0],buf_n[1]]);
	} else if (n <= 0xFFFFFFFF) {
		const buf_n = Buffer.allocUnsafe(4);
    	buf_n.writeUInt32LE(n);
		return Buffer.concat([new Uint8Array([0xfe]),buf_n]);
	} else {
		const buf_n = Buffer.allocUnsafe(8);
    	buf_n.writeBigUInt64LE(BigInt(n));
		return Buffer.concat([new Uint8Array([0xff]),buf_n]);
	}
}

function int2hex(str_n) {
    let n = bignum(str_n);
    let temp_buff = n.toBuffer();
    temp_buff.reverse();
    let buff = Buffer.alloc(32,0);
    for (let i = 0; i < temp_buff.length; i++) {
        buff[i] = temp_buff[i];
    }
    buff.reverse();
    return buff;
}

function float2hex(str_n) {
    let n = bignum(parseFloat(str_n) * 10000000000);
    let temp_buff = n.toBuffer();
    temp_buff.reverse();
    let buff = Buffer.alloc(32,0);
    for (let i = 0; i < temp_buff.length; i++) {
        buff[i] = temp_buff[i];
    }
    buff.reverse();
    return buff;
}

function GetTx(ts,fork,nonce,from_,to_,amount,gasPrice,gasLimit,data_str) {
	const nVersion = Buffer.allocUnsafe(2);
    nVersion.writeUInt16LE(1);

    const nType = Buffer.allocUnsafe(2);
    nType.writeUInt16LE(0);

    const nTimeStamp = Buffer.allocUnsafe(4);
    nTimeStamp.writeUInt32LE(ts);

    const hashFork = Buffer.allocUnsafe(32);
    hashFork.write(fork,'hex');

    const nTxNonce = Buffer.allocUnsafe(8);
	nTxNonce.writeBigUInt64LE(BigInt(nonce));

    const from = utils.Addr2Hex(from_);
    const to = utils.Addr2Hex(to_);
    const nAmount = float2hex(amount);
    //console.log(nAmount)
    const nGasPrice = float2hex(gasPrice);
    const nGasLimit = int2hex(gasLimit);

    let TxData = Buffer.alloc(1,0);
    if (data_str.length > 0) {
        const hex = Buffer.from(data_str,'hex');
        //let prefix = Buffer.from([1,1,1,hex.length]);
        TxData = Buffer.concat([hex])
    }
    const tx_data = Buffer.concat([nVersion,nType,nTimeStamp,hashFork,nTxNonce,from,to,nAmount,nGasPrice,nGasLimit,TxData]);

    const sigh_hash = blake.blake2b(tx_data,null,32);
	sigh_hash.reverse();
    return {"tx_hash":Buffer.concat([sigh_hash]).toString('hex'),
            "tx_hex" : tx_data.toString('hex')};
}

function Total(height) {
    const n = 2 * 24 * 60 * 3;
    const a = Math.floor(height / n);
    const b = height % n;
    let reward = 130.0;
    let s = 0;
    for (let i = 0; i < a; i++) {
      s += reward * n;
      reward = reward / 2;
    }
    s += b * reward;
    return s;
  }


function GetVote(delegate_,owner_,rewardmode_) {
    let prefix = Buffer.from([7, 0]);
    let delegate = utils.Addr2Hex(delegate_);
    let owner = utils.Addr2Hex(owner_);
    let rewardmode = Buffer.allocUnsafe(4);
    rewardmode.writeUInt32LE(rewardmode_);
    const hex = Buffer.concat([delegate,owner,rewardmode]);
    let hex_addr = Buffer.concat([prefix, blake.blake2b(hex,null,32).subarray(0,30)]);
    return {"hex" :  hex.toString('hex'),
            "address" : utils.Hex2Addr(hex_addr)};
}

module.exports = {
    GetTx: GetTx,
    Total: Total,
    GetVote: GetVote
};