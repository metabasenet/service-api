const Web3 = require('web3');
const mysql = require('mysql');
const Common = require('ethereumjs-common').default;
const Tx = require('ethereumjs-tx').Transaction;
let fs =require('fs');
let moment= require('moment');
// mainnet
//const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
// testnet
//const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
//const web3=new Web3('https://shangqingdong.work/bsc/');
const web3=new Web3('https://shangqingdong.work/bsc/');
const abi = [
    {
        "constant": false,
        "inputs": [{
            "internalType": "address",
            "name": "recipient",
            "type": "address"
        }, {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
        }],
        "name": "transfer",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }];


const mnt_addr = '0x450af0a7c8372eee72dd2e4833d9aac4928c151f';
//const bridge_addr = '0x0873093DEb492A6425d85906E2CE6E856BCDC71F';
const bridge_addr = '0x08f9BA8014Ba6f2150287F778f03E9aE6b1FF398';
//const bridge_key = '0x589dac19a0225798be3848586132e9bb22bf2ecdd7c55240e9e3106ebda6e53f';
//const bridge_key = '589dac19a0225798be3848586132e9bb22bf2ecdd7c55240e9e3106ebda6e53f';
const bridge_key = '8eccda008ddfa62c7b15b7a727d4205682869bb5a1e5d00f6642c580c6c19ce2';
web3.eth.accounts.wallet.add(bridge_key);

const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'mnt',
    password: '1234qwer',
    port: '3306',
    database: 'mnt'
});
conn.connect();

function Update(id, bsc_txid) {
    const sql = 'update mnt_bsc set bsc_txid = ?, state = 1, bsc_time = ? where id = ?'
    const sqlParams = [bsc_txid, (0 | Date.now() / 1000), id];
    conn.query(sql, sqlParams, function (error, results, fields) {
        if (error) throw error;
        console.log('bsc OK.');
    });
}
/*
function transfer(to, amount, id) {
    const mnt = new web3.eth.Contract(abi, mnt_addr);
    mnt.methods.transfer(to, web3.utils.toWei(amount.toString(), 'ether')).send({
        from: bridge_addr,
        gasLimit: web3.utils.toHex(80000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei'))
    }).then(
        (ret) => {
            Update(id, ret.transactionHash);
        }
    );
}*/

function transfer(toAddr, amount, id) {
    return new Promise(fun => {
        web3.eth.getTransactionCount(bridge_addr, (err, txCount) => {         
            let con = new web3.eth.Contract(abi, mnt_addr);
            let txObject = {
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei')),
                to: mnt_addr,
                data: con.methods.transfer(toAddr, web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether'))).encodeABI()    // if bnb ,not need send.
            }           
            //56
            const BSC_MAIN = Common.forCustomChain('mainnet', { name: 'bnb', networkId: 97, chainId: 97 }, 'petersburg');
            const tx = new Tx(txObject, { common: BSC_MAIN });
            let privKey = new Buffer.from(bridge_key, 'hex');
            tx.sign(privKey);
            const serializedTx = tx.serialize();
            //console.log('hash',tx.hash(true));
            const raw = '0x' + serializedTx.toString('hex');
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                if (err != null) {
                    fun(err);                    
                } else {
                    //console.log('txHash',txHash);
                    Update(id, txHash);
                    fun(txHash);                  
                }
                //console.log('err:', err, 'txHash:', txHash);            
            });

        });
    });
};
function Run(txid, from, value) {
    let sql = 'select id,mnt_bsc.`value`,addr.eth_addr as `to`,mnt_bsc.id from mnt_bsc inner join addr on addr.mnt_addr = mnt_bsc.`from` where mnt_bsc.state is null and mnt_bsc.`type` = 2';
    conn.query(sql, async function (error, results, fields) {
        if (error) throw error;
        for (const obj of results) {
            await transfer(obj.to, obj.value, obj.id);
        }
        setTimeout(Run, 5000);
        
        // let currentTime =moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        // fs.writeFile('../logs/log.txt', currentTime, '', function (err) {
        //     if (err) {
        //       throw err;
        //     }
        // });
    });
}

Run();
