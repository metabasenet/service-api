#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import ed25519
from binascii import hexlify, unhexlify

url = "http://127.0.0.1:7711"

importprivkey  = 'ab14e1de9a0e805df0c79d50e1b065304814a247e7d52fc51fd0782e0eec27d6'
#unlockkey 68e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc530 123 0
#//1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3

transaction = {
    "txid": "85b36243c17dbe53177be4c900d67b3b82c32ef3f649879b7c671728011ed432",
    "version": 1,
    "type": "token",
    "time": 1648607613,
    "nonce": 2,
    "from": "1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3",
    "to": "20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js",  # 投票地址
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

tx = {
    "time": transaction["time"],
    "fork": transaction["fork"],
    "nonce": transaction["nonce"],
    "from": transaction["from"],
    "to": transaction["to"],
    "amount": transaction["amount"],
    "gasprice": transaction["gasprice"],
    "gaslimit": transaction["gaslimit"],
    "data": transaction["data"]
}

response = requests.post(url+"/createtransaction", json=tx)
ret = json.loads(response.text)
sk = ed25519.SigningKey(unhexlify(importprivkey)[::-1])
sign_data = sk.sign(unhexlify(ret["tx_hash"])[::-1])
tx_hex = ret["tx_hex"] + hex(len(sign_data))[2:] + hexlify(sign_data).decode()
assert(tx_hex == transaction["serialization"])

addressdata = {
    "address": "20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js",
    "ismine": True,
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

vote = {
    "delegate" : addressdata["templatedata"]["vote"]["delegate"],
    "owner" : addressdata["templatedata"]["vote"]["owner"],
    "rewardmode" : addressdata["templatedata"]["vote"]["rewardmode"]
}
# 根据vote生成投票地址和模板数据
response = requests.post(url+"/GetVote", json=vote)
ret = json.loads(response.text)
assert(ret["address"] == addressdata["address"])
assert(ret["address"] == transaction["to"])
assert('010101' + hex(len(ret["hex"])//2)[2:] + ret["hex"] == transaction["data"])

vote = {
    'address': '20w0e9rcg7nq4pet8yz8ch2jt46f7hyjg256ys7dh5gddp0pja5mtm3js',
    'delegate': '20m02d02b17s1bq6z40kf10gkgytxseq5dzpgm3shhhsa2nj6dva81qvy',
    'owner': '1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3',
    'rewardmode': 0,
    'hex':
        '070002d46e4656a1728c310f0aed6fe5badcb5871382f02620dfdc15f2094b802600050168e4dca5989876ca64f16537e82d05c103e5695dfaf009a01632cb33639cc53000000000',
  }

response = requests.post(url+"/GetVote", json=vote)
ret = json.loads(response.text)
assert('0700' + ret['hex'] == vote['hex'])
assert(ret['address'] == vote['address'])
