#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from sshtunnel import SSHTunnelForwarder
import time 
#sudo pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple pip -U
#sudo pip3 install sshtunnel -i https://pypi.tuna.tsinghua.edu.cn/simple

local_ip = '0.0.0.0'
local_port = 3306

remote_ip = '18.163.119.181'
remote_port = 3306

user_name = 'ubuntu'
#user_pass = '1234qwer'
ssh_file = '/home/zdw/ssh/metabasenet.pem'

with SSHTunnelForwarder(
    (remote_ip, 22),    # 22 is remote ssh service port
    ssh_username=user_name,     
    ssh_pkey=ssh_file,  
    #ssh_password=user_pass, 
    remote_bind_address=('127.0.0.1', remote_port),
    local_bind_address=(local_ip, local_port) 
) as server:
    server.start()
    print("Local service port:",server.local_bind_port)
    while True:
        #data = {
        #    "id":1,
        #    "method":"getforkheight",
        #    "jsonrpc":"2.0",
        #    "params": {}
        #}
        #url = "http://%s:%s" % (local_ip,local_port)
        #response = requests.post(url, json=data)
        #obj = json.loads(response.text)
        #print("test ok. forkheight:",obj["result"])
        print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),"sleep 60s ...")
        time.sleep(60)
        #input("Press enter to end the current service.")
    #server.close()
