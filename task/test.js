import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
//const transactionHash = '0x506ce432f1a3795aaae75c83fdbb688ee9e91c92519ab6819808c456d879c362';
const transactionHash = '0x638b295cab62dd09356d36ed7be01cf8ef27f2b74e6a4fc80d5f991f6700cc69';
const result = await provider.send('debug_traceTransaction', [transactionHash]);
console.log('指令长度', result.structLogs.length);
console.log('历史块高', (await provider.getTransactionReceipt(transactionHash)).blockNumber);
console.log('当前块高', await provider.getBlockNumber());