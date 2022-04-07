#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import ed25519
from binascii import hexlify, unhexlify
import hashlib
import struct
import time

#url = "http://127.0.0.1:9906"
url = "http://159.138.123.135:9906"


fork = "00000001cf57212c59faebd3409ae04291c7628cb0d7de8897682a9ac587627e"

genesis_privkey = 'ab14e1de9a0e805df0c79d50e1b065304814a247e7d52fc51fd0782e0eec27d6'
genesis_addr = '1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3'

response = requests.get("%s/listfork" % url)
obj = json.loads(response.text)
assert(obj[1]["symbol"] == "BTCA")
assert(obj[1]["fork"] == fork)

print("分支信息:",obj[1]["fork"])

response = requests.get("%s/listunspent/%s/%s" % (url,fork,genesis_addr))
obj = json.loads(response.text)

vin = obj["addresses"][0]["unspents"]
if len(vin) == 0:
    print("没有金额了")
    exit()
max_utxo = {"amount":0}
for obj in vin:
    if obj["amount"] > max_utxo["amount"]:
        max_utxo = obj

if max_utxo["amount"] < 1.01:
    print("金额不足")
    exit()

transaction = {
        "type" : "token",                                                               # 交易类型(token:普通交易，defi-relation：推广交易)
        "time" : int(time.time()),                                                            # 交易时间戳
        "lockuntil" : 0,                                                                # 交易的锁定高度(0表示不锁定)
        "anchor" : fork,                                                                # 分支hash(fork id)                                                
        "vin" : [max_utxo],
        "sendto" : "1549pyzf8dhx7r4x40k5j80f12btkpqfprjp134bcgcrjn963nzsx57xb",         # 接收本交易资金的地址
        "amount" : 1.000000,                                                            # 接收本交易的金额
        "txfee" : 0.010000,                                                             # 本交易的手续费
        "data" : "",                                                                    # 本交易的附加数据
    }

response = requests.post(url+"/createtransaction",json=transaction)
ret = json.loads(response.text)
# ret["tx_hex"] 交易的16进制字符串
# ret["tx_hash"] 要签名的字符串
sk = ed25519.SigningKey(unhexlify(genesis_privkey)[::-1])
sign_data = sk.sign(unhexlify(ret["tx_hash"])[::-1])
tx_hex = ret["tx_hex"] + hex(len(sign_data))[2:] + hexlify(sign_data).decode()

response = requests.get("%s/sendrawtransaction/%s" % (url,tx_hex))
obj = json.loads(response.text)
print("交易ID:",obj)



