 #### 1）投票奖励： 
  &emsp; &emsp;用户投票后会根据投票额的大小，总投票额的大小获取奖励，奖励的规则见<a href='publish.html?language=zh'>帮助说明</a>--dpos投票奖励制度，有详细说明
 #### 2）赎回锁定： 
  &emsp; &emsp;若赎回投票金额，赎回的金额会保存在赎回地址中，总金额会在赎回地址中锁定100天，每天按照总金额1%的比例解除锁定，即每天可赎回1%，
  > 举例，投票地址有2000，赎回1000，则投票地址剩余1000，赎回地址增加1000，则第0天，赎回地址锁定金额1000，赎回地址可赎回金额0，第1天赎回地址锁定金额990，赎回地址可赎回金额10，第2天赎回地址锁定金额980，赎回地址可赎回金额20,以此类推，
  
  若赎回地址中有锁定金额，再次撤投，则赎回地址中的锁定金额=原锁定金额+撤投金额，重新按照1%每天计算解锁
 #### 3）奖励发放：
 &emsp; &emsp;每天发放一次奖励，按高度计算每天，每天为4320高度，当高度除以4320余1时，发放奖励，如果一个区块存储不完所有奖励交易，则会在后面的区块中存储奖励交易。
 #### 4）温馨提示：
 &emsp; &emsp;建议长时间投票持续获取收益，若赎回投票金额，考虑到手续费因素，建议赎回地址中的锁定金额完全解锁后再赎回