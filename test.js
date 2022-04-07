
const lib = require('./lib.js');

let transaction = {
        "txid" : "61c97a03a90c1b746735e195262338f08a61ffc53b45430a36835495420a060a",
        "version" : 1,
        "type" : "token",
        "time" : 1640593923,
        "lockuntil" : 0,
        "anchor" : "00000000a137256624bda82aec19645b1dd8d41311ceac9b5c3e49d2822cd49f",
        "blockhash" : "",
        "vin" : [
            {
                "txid" : "61c9767e14cbdbee892eaabd02f0fbdd68038b059d766b7c32f8c94f848981d5",
                "out" : 1
            }
        ],
        "sendfrom" : "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3",
        "sendto" : "20m02ft8tk86g2hc4r45ac1xp5emp1qwdyv60k2vx456mx434q6nkb78g",
        "amount" : 100.000000,
        "txfee" : 0.010000,
        "data" : "",
        "sig" : "1fe5524404a73a5e6b93d5c45e9eccebfde5b49dd7fba11455c114981337f6e0ef169fe1b9378fc2a0b845f43de1a84ba6b6161ee82776a1d3903e738e5c9206",
        "fork" : "00000000a137256624bda82aec19645b1dd8d41311ceac9b5c3e49d2822cd49f",
        "confirmations" : 0,
        "serialization":"01000000037ac961000000009fd42c82d2493e5c9bacce1113d4d81d5b6419ec2aa8bd24662537a10000000001d58189844fc9f8327c6b769d058b0368ddfbf002bdaa2e89eedbcb147e76c9610102050027e91a9a0d014584c10aa607b62ba960df8df6cc098b7d214d4e9064b9ab00e1f50500000000102700000000000000401fe5524404a73a5e6b93d5c45e9eccebfde5b49dd7fba11455c114981337f6e0ef169fe1b9378fc2a0b845f43de1a84ba6b6161ee82776a1d3903e738e5c9206"
    };
    
let ret = lib.GetTx(transaction.type,transaction.time,transaction.lockuntil,transaction.anchor,
                    transaction.vin,transaction.sendto,transaction.amount,transaction.txfee,transaction.data);
console.log(ret);
if (ret.tx_hex == transaction.serialization.substring(0,ret.tx_hex.length)) {
    console.log("OK");
} else {
    console.log("err");
}
