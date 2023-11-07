import Web3 from 'web3';

// 连接到以太坊节点
const web3 = new Web3('https://bsc-dataseed1.binance.org/'); 
//用您自己的Infura项目ID替换

// 交易哈希，将其替换为您要查询的实际交易哈希
const transactionHash = '0x769dc8719b71c58039db8d57fab79c422c5007bf96588568bb1fd23612cfb88e';

// 获取交易的内部交易
//const receipt = await web3.eth.getTransactionReceipt(transactionHash)
//const internalTransactions = receipt.logs.filter((log) => log.topics[0] === '0x0000000000000000000000000000000000000000000000000000000000000000');
//console.log(internalTransactions)


web3.eth.currentProvider.send(
    {
      jsonrpc: '2.0',
      method: 'debug_traceTransaction',
      params: [transactionHash, {}], // 可选参数，这里为空对象，您可以根据需要传递其他选项
      id: new Date().getTime()
    },
    (error, result) => {
      if (!error) {
        console.log('Trace Result:', result);
      } else {
        console.error('Error tracing transaction:', error);
      }
    }
  );

/*
web3.eth.getTransaction(transactionHash, (error, transaction) => {
    //console.log('ddd')
  if (!error) {
    web3.eth.getTransactionReceipt(transactionHash, (error, receipt) => {
        console.log(receipt)
      if (!error) {
        const internalTransactions = receipt.logs.filter((log) => log.topics[0] === '0x0000000000000000000000000000000000000000000000000000000000000000');
        console.log('Internal Transactions:', internalTransactions);
      } else {
        console.error('Error fetching transaction receipt:', error);
      }
    });
  } else {
    console.error('Error fetching transaction:', error);
  }
});*/