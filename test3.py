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

genesis_addr = '1632srrskscs1d809y3x5ttf50f0gabf86xjz2s6aetc9h9ewwhm58dj3'

response = requests.get("%s/transctions/%s" % (url,genesis_addr))
obj = json.loads(response.text)
print("交易记录:",obj)