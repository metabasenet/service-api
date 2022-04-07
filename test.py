#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import ed25519
from binascii import hexlify, unhexlify
import hashlib
import struct

#url = "http://127.0.0.1:9906/createtransaction"
url = "http://159.138.123.135:9906/createtransaction"

#Address = '1549pyzf8dhx7r4x40k5j80f12btkpqfprjp134bcgcrjn963nzsx57xb'
#PubKey = 'f3afc3a42a31836c9111acc4f65d3bf512e10124cb04a4137c7a6ce87d6f1329'
#Secret = '141a6728ded4f83f767ea770e3582be497c5088fcc3b9ca248751887534f5197'

#Address = 1d3x7mhq2h0cx027g4qvvt69szcj406g9ybdpkkaad50t3290fe76eqny
#pubkey = 8e7b2089a141694acd69dbf2091a4024fb3919bdf725f008d01988e2467afa68
#Secret = fd0d93cfd8712f0b39165b6fcd854851ca6060e47480439861f0df3d66d074ae

genesis_privkey = 'ab14e1de9a0e805df0c79d50e1b065304814a247e7d52fc51fd0782e0eec27d6'
genesis_addr = '1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3'


transaction = {
        "type" : "token",                                                               # 交易类型(token:普通交易，defi-relation：推广交易)
        "time" : 1640593923,                                                            # 交易时间戳
        "lockuntil" : 0,                                                                # 交易的锁定高度(0表示不锁定)
        "anchor" : "00000000a137256624bda82aec19645b1dd8d41311ceac9b5c3e49d2822cd49f",  # 分支hash(fork id)                                                
        "vin" : [                                                                       # utxo数组，自己要花费的utxo
            {
                "txid" : "61c9767e14cbdbee892eaabd02f0fbdd68038b059d766b7c32f8c94f848981d5",    # utxo 的hash(id)
                "out" : 1                                                                      # 是否找零，1表示找零，0表示表示转账
            }
        ],
        "sendto" : "20m02ft8tk86g2hc4r45ac1xp5emp1qwdyv60k2vx456mx434q6nkb78g",         # 接收本交易资金的地址
        "amount" : 100.000000,                                                          # 接收本交易的金额
        "txfee" : 0.010000,                                                             # 本交易的手续费
        "data" : "",                                                                    # 本交易的附加数据
    }

# 交易序列化后的数据（包含签名数据）
serialization = "01000000037ac961000000009fd42c82d2493e5c9bacce1113d4d81d5b6419ec2aa8bd24662537a10000000001d58189844fc9f8327c6b769d058b0368ddfbf002bdaa2e89eedbcb147e76c9610102050027e91a9a0d014584c10aa607b62ba960df8df6cc098b7d214d4e9064b9ab00e1f50500000000102700000000000000401fe5524404a73a5e6b93d5c45e9eccebfde5b49dd7fba11455c114981337f6e0ef169fe1b9378fc2a0b845f43de1a84ba6b6161ee82776a1d3903e738e5c9206"

response = requests.post(url,json=transaction)
ret = json.loads(response.text)
assert(ret["tx_hash"] == "3bcd04dbba53815476c49a6023021806116f6ffa3df4ec5549df08f2ba4df5b3")
assert(ret["tx_hex"] == "01000000037ac961000000009fd42c82d2493e5c9bacce1113d4d81d5b6419ec2aa8bd24662537a10000000001d58189844fc9f8327c6b769d058b0368ddfbf002bdaa2e89eedbcb147e76c9610102050027e91a9a0d014584c10aa607b62ba960df8df6cc098b7d214d4e9064b9ab00e1f50500000000102700000000000000")

# ret["tx_hex"] 交易的16进制字符串
# ret["tx_hash"] 要签名的字符串
sk = ed25519.SigningKey(unhexlify(genesis_privkey)[::-1])
sign_data = sk.sign(unhexlify(ret["tx_hash"])[::-1])

assert(hexlify(sign_data).decode() == "1fe5524404a73a5e6b93d5c45e9eccebfde5b49dd7fba11455c114981337f6e0ef169fe1b9378fc2a0b845f43de1a84ba6b6161ee82776a1d3903e738e5c9206")

# 生成要广播的字符串
obj = ret["tx_hex"] + hex(len(sign_data))[2:] + hexlify(sign_data).decode()
assert(obj == serialization)
print("test OK")