const lib = require('./lib.js');
//importprivkey ab14e1de9a0e805df0c79d50e1b065304814a247e7d52fc51fd0782e0eec27d6 123
//unlockkey 68e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc530 123 0
//1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3

//addnewtemplate vote '{"delegate": "20m02d02b17s1bq6z40kf10gkgytxseq5dzpgm3shhhsa2nj6dva81qvy", "owner": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3", "rewardmode":0}'
//20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js

//addnewtemplate vote '{"delegate": "20m02d02b17s1bq6z40kf10gkgytxseq5dzpgm3shhhsa2nj6dva81qvy", "owner": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3", "rewardmode":1}'
//20w0f65bk6f27cyrac6r7qgmebnv70q9cs8xz9cyh1acdk5a4tk7r5zmv

//sendfrom 1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3 20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js 200
//85b36243c17dbe53177be4c900d67b3b82c32ef3f649879b7c671728011ed432

let transaction = {
    "txid": "85b36243c17dbe53177be4c900d67b3b82c32ef3f649879b7c671728011ed432",
    "version": 1,
    "type": "token",
    "time": 1648607613,
    "nonce": 2,
    "from": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3",
    "to": "20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js",
    "amount": "200.0000000000",
    "gaslimit": 13700,
    "gasprice": "0.0000010000",
    "gasused": 13700,
    "txfee": "0.0137000000",
    "data": "0101014602d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53000000000",
    "sig": "387aa107a4ccd37816f9103cf05d3d37dd980c65db4c8a8e140fdf1b3c65c1b85c97aa06a898d9c3bdf1470618c19644482d768da6439bddf718658914abc705",
    "fork": "0000000027734445141a588af514fba7f24869c830399fe09a1355815b60040d",
    "height": 22,
    "blockhash": "00000016b8b3a1db3bfb02dd4f81e337390962dc89458b82d1f5f2e68007a318",
    "confirmations": 4,
    "serialization": "010000007dc143620000000027734445141a588af514fba7f24869c830399fe09a1355815b60040d02000000000000000168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc530026951d202db1a2cb19dec4d1150fa789e215a8ac8d0f7483b4b6e3d90e1e40007000000000000000000000000000000000000000000000000000001d1a94a2000000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000035840101014602d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc5300000000040387aa107a4ccd37816f9103cf05d3d37dd980c65db4c8a8e140fdf1b3c65c1b85c97aa06a898d9c3bdf1470618c19644482d768da6439bddf718658914abc705"
}

const ts = transaction.time;  
const fork = transaction.fork; 
const nonce = transaction.nonce; 
const from = transaction.from;   
const to = transaction.to;       
const amount = transaction.amount;   
const gasPrice = transaction.gasprice;    
const gasLimit = transaction.gaslimit;    
const ret1 = lib.GetTx(ts, fork, nonce, from, to, amount, gasPrice, gasLimit, transaction.data);

console.log(ret1.tx_hash);
if (ret1.tx_hex == transaction.serialization.substring(0, ret1.tx_hex.length)) {
    console.log("tx_hex OK");
} else {
    console.log("tx_hex err");
}
//0101014602d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53000000000
let addressdata = {
    "address": "20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js",
    "ismine": true,
    "type": "template",
    "template": "vote",
    "templatedata": {
        "type": "vote",
        "hex": "070002d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53000000000",
        "vote": {
            "delegate": "20m02d02b17s1bq6z40kf10gkgytxseq5dzpgm3shhhsa2nj6dva81qvy",
            "owner": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3",
            "rewardmode": 0
        }
    }
}
let vote = addressdata.templatedata.vote;
let ret2 = lib.GetVote(vote.delegate,vote.owner,vote.rewardmode);
if (transaction.data == '01010146' + ret2.hex) {
    console.log('data OK');
} else {
    console.log('data Err');
}

if (transaction.to == ret2.address) {
    console.log('address OK');
} else {
    console.log('address Err');
}

transaction = {
    "txid": "85b36243c18af06fd5d9c2ff23d62648d202bb9555ad054ee0cc6b10ea520b31",
    "version": 1,
    "type": "token",
    "time": 1648607626,
    "nonce": 3,
    "from": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3",
    "to": "20w0f65bk6f27cyrac6r7qgmebnv70q9cs8xz9cyh1acdk5a4tk7r5zmv",
    "amount": "200.0000000000",
    "gaslimit": 13700,
    "gasprice": "0.0000010000",
    "gasused": 13700,
    "txfee": "0.0137000000",
    "data": "0101014602d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53001000000",
    "sig": "f8b3cf99e80efb662f4ea1d6821fabc27ac88150e35e9a3aa37ba9ed2ded0e91dc855320ce89e83a3b52062e21c77e61273dc07e2bc6bee85f20f662934b5f0c",
    "fork": "0000000027734445141a588af514fba7f24869c830399fe09a1355815b60040d",
    "height": 23,
    "blockhash": "000000176ee1a6f1e41070b6a4798596c2276573c9418d7290bd5a1812e41dbb",
    "confirmations": 11,
    "serialization": "010000008ac143620000000027734445141a588af514fba7f24869c830399fe09a1355815b60040d03000000000000000168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53002cfd44495d9980ad1b3f43bca2c5d70765d8ec27bb0610a7b76c4337315f30007000000000000000000000000000000000000000000000000000001d1a94a2000000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000035840101014602d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc5300100000040f8b3cf99e80efb662f4ea1d6821fabc27ac88150e35e9a3aa37ba9ed2ded0e91dc855320ce89e83a3b52062e21c77e61273dc07e2bc6bee85f20f662934b5f0c"

}

addressdata = {
    "address": "20w0f65bk6f27cyrac6r7qgmebnv70q9cs8xz9cyh1acdk5a4tk7r5zmv",
    "ismine": true,
    "type": "template",
    "template": "vote",
    "templatedata": {
        "type": "vote",
        "hex": "070002d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53001000000",
        "vote": {
            "delegate": "20m02d02b17s1bq6z40kf10gkgytxseq5dzpgm3shhhsa2nj6dva81qvy",
            "owner": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3",
            "rewardmode": 1
        }
    }
}

