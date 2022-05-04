#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import json
import ed25519
from binascii import hexlify, unhexlify
import hashlib
import struct
import time


{
    "transaction" : {
        "txid" : "19ca624cf151805676e94c0363d0993ab96b369ec4ca76b7c81ecb8b6bdcf9c7",
        "version" : 1,
        "type" : "token",
        "time" : 1649209681,
        "nonce" : 1,
        "from" : "20w0cev9mg0zwz906qjfag6pqf48k2dcvpq1528vcfyxhx11khkqb072j",
        "to" : "1nh9060wk5t4g2828wd8zw9x4aysvhca4b3f7yd6mmnzhkvrfv9ptxp89",
        "amount" : "1.0000000000",
        "gaslimit" : 10000,
        "gasprice" : "0.0000010000",
        "gasused" : 10000,
        "txfee" : "0.0100000000",
        "data" : "00",
        "sig" : "a798e29da722deaf099ff8988cdd424102727e4e1416c8a54ae6dd7f27870e5ffc079f03b88077be397a459cc2b8dc39d856665f53aa115d4887f0037eaadd00",
        "fork" : "000000004133280e17d29214061af6b80e3e9a3766e4e3169e3fe6db344b58c7",
        "height" : 51475,
        "blockhash" : "0000c913d2578a09aa455caf80ac39568dceaa33c54c64beae1d6979a039b427",
        "confirmations" : 56229
    }
}
