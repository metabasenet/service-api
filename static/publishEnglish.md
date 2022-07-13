### MNT publishing mechanism

#### MNT release plan
> Total circulation:21,000,000
Initial flux:1,050,000

#### MNT release cycle
 &emsp; &emsp;A total of 21 million MNT were issued, with an initial circulation of 1.05 million, with a block release interval of 30 seconds and decay every six and a half years（Height period is 2 * 60 * 24 * 365 * 6=6307200）In the first 6 years, 1.58 coins will be issued per block (each coin will be used for voting reward and promotion reward, each accounting for 50%), and in the next 6 years, the additional issuance will be halved, and so on

The situation of block production in 1-6 years

>each 1.58
Every minute 1.58 * 2=3.16（Among them, 1.58 is used for voting reward and 1.58 is used for promotion reward）
Per hour 1.58 * 2 * 60 =189.6 （Among them, 94.8 is used for voting reward and 94.8 is used for promotion reward）
Every day 1.58 * 2  * 60 * 24 =4550.4 （Among them, 2275.2 is used for voting reward and 2275.2 is used for promotion reward）
A month 1.58 * 2  * 60 * 24 * 30 =136512（Among them, 68256 is used for voting reward and 68256 is used for promotion reward）
Every year 1.58 * 2  * 60 * 24 * 365 =1660896（Among them, 830448 is used for voting reward and 830448 is used for promotion reward）

The situation of block production in 7-12 years
> each 0.79
Every minute 0.79 * 2  = 1.58（Among them, 0.79 is used for voting reward and 0.79 is used for promotion reward）
Per hour 0.79 * 2 * 60 =94.8 （Among them, 47.4 is used for voting reward and 47.4 is used for promotion reward）
Every day 0.79 * 2 * 60 * 24 =2275.2 （Among them, 1137.6 is used for voting reward and 1137.6 is used for promotion reward）
A month 0.79 * 2 * 60 * 24 * 30 =68256（Among them, 34128 is used for voting reward and 34128 is used for promotion reward）
Every year 0.79 * 2 * 60 * 24 * 365 =830448 （Among them, 415224 is used for voting reward and 415224 is used for promotion reward）

The situation of block production in 13-18 years
> each 0.395
…

The situation of block production in 19-24 years
> each 0.1975
…
…

After that, every six years, the additional issuance is halved, and so on

#### MNT reward system
&emsp;&emsp;MNT reward is the income of the coin holder. MNT rewards two situations, voting reward and promotion reward, each block, voting reward and promotion reward account for 50%, voting reward per block (1-6 years) : 0.79 pieces (7-12 years: 0.395, 13-18 years: 0.1975...)
###### 1)Dpos voting reward system
&emsp;&emsp;All MNT players with a certain number of votes can vote and 50% of the total output per day is used for voting rewards
&emsp;&emsp;DPOS voting rules are detailed in the voting instructions
&emsp;&emsp;***There are 27 DPOS voting nodes, and the initial voting amount of each node is 10,000 yuan and the upper limit is 1 million yuan. If the voting amount of a node is less than 10,000 yuan, the node does not participate in block generation. If the voting amount of a node is more than 1 million yuan, it is calculated as 1 million yuan***

The formula for calculating the success rate of voting nodes is as follows:

> SR=（∑i /(∑1 + ∑2+ ∑3+...+∑27)) * 100%
SR=Node success rate
∑i=Voting node voting amount
$∑1 + ∑2+ ∑3+...+∑27$ =Total vote amount of 27 nodes
∑i If the number of votes is less than 10,000 then ∑i=0
∑i If more than 1,000,000   then ∑i=1,000,000

If there are 27 nodes, the amount of each vote is as follows:

The amount of votes for nodes 1-10
> ∑1=1,000
∑2=2,000
∑3=3,000
∑4=4,000
∑5=5,000
∑6=6,000
∑7=70,000
∑8=80,000
∑9=90,000
∑10=100,000

The amount of votes for nodes 11-20 Each node is 500,000
The amount of votes for nodes 21-27
> ∑21=700,000 
∑22=800,000
∑23=900,000
∑24=1,000,000
∑25=1,100,000
∑26=1,200,000
∑27=1,300,000

According to the rules
> $∑1 + ∑2+ ∑3+...+∑27$=0+0+0+0+0+0+70,000+80,000+90,000+100,000 
+500,000 * 10 +700,000+800,000+900,000+1,000,000*4=11,740,000

The voting success rate of nodes 1-10 is(If the value is smaller than 10,000, blocks are not generated，***data is 0***)
> SR1=0
SR2=0
SR3=0
SR4=0
SR5=0
SR6=0
SR7=70,000 / 11,740,000=0.60%
SR8=80,000 / 11,740,000=0.68%
SR9=90,000/ 11,740,000=0.77%
SR10=100,000/ 11,740,000=0.85%

The voting success rate of nodes 1-10 is 500,000/11,740,000=4.3%
The voting success rate of nodes 1-10 is
> SR21=700,000 / 11,740,000=5.96%
SR22=800,000 / 11,740,000=6.81%
SR23=900,000 / 11,740,000=7.67%
SR24=1,000,000 / 11,740,000=8.52%
SR25=1,000,000 / 11,740,000=8.52%
SR26=1,000,000 / 11,740,000=8.52%
SR27=1,000,000 / 11,740,000=8.52%


The formula for voting returns is as follows：

> Ai= （Mi  /（M1 +M2 +M3 +… +Mn)）* W * 50%
Ai= A tidy
Mi= Vote amount
M1+M2+M3+...+Mn =Sum of all votes of the voting node
W=A piece of amount
Again, suppose an address is voted on node 10 is  50,000   The total vote of node 10 is 100,000,
Then the single block output reward of this address is (50,000/100,000) * 1.58 * 50%=0.395


###### 2)DEFI promote relationship rewards
&emsp;&emsp;When the promoted person purchases MNT, the purchased MNT is transferred to the MNT chain, and the promotion link relationship is activated.
&emsp;&emsp;Among them, 50 percent of the total output of the day is used to promote bonus rewards.
&emsp;&emsp;DEFI Relationship Bonus tiles (1-6 years) : 0.79(0.395 for 7-12 years, 0.1975 for 13-18 years...)

###### DEFI relational reward calculation formula
> A= (Ai/(A1+A2+A3+...+An)) * W * 50%
Ai=P1+P2+P3+...+Pn
Ai=The calculated value of promotion relationship for an address
W=The number of blocks issued
P=The promotion relationship holds the amount multiplied by the coefficient

There are four rules to promoting revenue rewards
> ***1、The balance of promoters and promotees takes the minimum value to participate in the calculation of promotion force
2、>200，Coefficient for 1
3、≥50 and ≤200 Coefficient for 1.5
4、<50 Coefficient for 1***

&emsp;&emsp;Suppose A recommends five people, B. C. D. E. F, respectively. A holds 500 MNT, B holds 2000 MNT,C holds 1,000 MNT, D holds 300 MNT, E holds 160 MNT, F holds 30 MNT, among which C is pushed to 10 people, and each person holds 180 MNT.
Calculate the generalized force of A according to the formula
> Ai=500+500 + 300 +160*1.5 +30 =1570

Calculate the generalized force of C according to the formula
> Ci=10 * 180 * 1.5 =2700

 Since the calculation force of the whole network is the same, it is omitted. Therefore, we only need to compare the promotion calculation force of A and C to compare their earnings. Obviously, the earnings of C are more than that of A.

























