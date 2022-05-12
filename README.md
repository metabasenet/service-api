### setup 
```
rsync -avz ../service-api mnt-sh:/home/ubuntu/mnt
sudo npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm i
./run.sh
```
### update price by mnt/usdt
```
node price.js
```

### uniswap bsc add
```
node bsc_add.js
```

### uniswap bsc mod
```
node bsc_mod.js
```