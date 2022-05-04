#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import ed25519
from binascii import hexlify, unhexlify
import hashlib
import struct

url = "http://127.0.0.1:7711"


genesis_privkey = 'd2feeab10e27831b0a3aa8d9b1040bc722975cf9d050d66cd3732c8a90915903'
genesis_addr = '1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58'


transaction = {
    "txid" : "19ca625abc471e69bd33b2b6fe6333c3945d164da02c650eb06326e4f910692f",
    "version" : 1,
    "type" : "token",
    "time" : 1650113607,
    "nonce" : 1,
    "from" : "1yq024eeg375yvd3kc45swqpvfz0wcrsbpz2k9escysvq68dhy9vtqe58",
    "to" : "1f1bt076cwdydnje00apvr3q8g68270x61fw1ste4pnb5ghr5mqympmzj",
    "amount" : "20.0000000000",
    "gaslimit" : 20000,
    "gasprice" : "0.0000010000",
    "gasused" : 20000,
    "txfee" : "0.0200000000",
    "data" : "00",
    "sig" : "4f30b5e651b5c516ec18ccb5a359c3af3353518925e8a77b07383a36f902c7ab100f84c2c6b76534674fcafa38dc889e3c6e76290b157b2cd4f0d2e4169f4d06",
    "fork" : "000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c7",
    "height" : 0,
    "blockhash" : "",
    "serialization":"0100000047bc5a62000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c701000000000000000177f2b1217377f62cbb34c5b72b63c6c17fdb5e9e0b6173b4edcb19d03922c0f501fda505475856b5c4e91cf80ba683239081e80ebcad02c0c9da7ce3cc1ca057780000000000000000000000000000000000000000000000000000002e90edd00000000000000000000000000000000000000000000000000000000000000027100000000000000000000000000000000000000000000000000000000000004e2000404f30b5e651b5c516ec18ccb5a359c3af3353518925e8a77b07383a36f902c7ab100f84c2c6b76534674fcafa38dc889e3c6e76290b157b2cd4f0d2e4169f4d06"
}


#serialization = "01000000037ac961000000009fd42c82d2493e5c9bacce1113d4d81d5b6419ec2aa8bd24662537a10000000001d58189844fc9f8327c6b769d058b0368ddfbf002bdaa2e89eedbcb147e76c9610102050027e91a9a0d014584c10aa607b62ba960df8df6cc098b7d214d4e9064b9ab00e1f50500000000102700000000000000401fe5524404a73a5e6b93d5c45e9eccebfde5b49dd7fba11455c114981337f6e0ef169fe1b9378fc2a0b845f43de1a84ba6b6161ee82776a1d3903e738e5c9206"

response = requests.post(url+"/createtransaction",json=transaction)
ret = json.loads(response.text)
print(ret)
#assert(ret["tx_hash"] == "969e0fde99c16fc03ebfc35286a24c77004c2018917235beb6c8f5a47a403c94")
#assert(ret["tx_hex"] == "01000000037ac961000000009fd42c82d2493e5c9bacce1113d4d81d5b6419ec2aa8bd24662537a10000000001d58189844fc9f8327c6b769d058b0368ddfbf002bdaa2e89eedbcb147e76c9610102050027e91a9a0d014584c10aa607b62ba960df8df6cc098b7d214d4e9064b9ab00e1f50500000000102700000000000000")
sk = ed25519.SigningKey(unhexlify(genesis_privkey)[::-1])
sign_data = sk.sign(unhexlify(ret["tx_hash"]))
print(hexlify(sign_data).decode())


#assert(hexlify(sign_data).decode() == "1fe5524404a73a5e6b93d5c45e9eccebfde5b49dd7fba11455c114981337f6e0ef169fe1b9378fc2a0b845f43de1a84ba6b6161ee82776a1d3903e738e5c9206")

#obj = ret["tx_hex"] + hex(len(sign_data))[2:] + hexlify(sign_data).decode()
#assert(obj == transaction["serialization"])
#print("test OK")