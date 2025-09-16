+++
date = '2019-02-19T15:50:21+08:00'
draft = false
title = 'fateiceの“NOIP模拟赛”'
+++
{{< katex >}}
## 1.树上游走
### Description
Elephant有一棵n个点的树 \
有m次询问，每次给定起点s和终点t，Elephant会从s走到t \
由于Elephant眼神不好，它会按如下方式走路：
1. 初始时在s，如果到达t就立刻停止；
2. 如果相邻点中存在离s更远且没走过的点，那么等概率随机一个满足条件的点走过去；
3. 否则，往s所在方向走一步。

你需要求出Elephant期望经过多少个点（包括s和t）\
一个点被多次经过只计算一次

Input \
第一行两个整数n,m \
接下来n-1行每行两个整数u,v表示一条边 \
接下来m行每行两个整数s,t表示一组询问

Output \
每组询问输出一行一个实数表示答案，保留一位小数

Sample Input
```text
3 3
1 2
2 3
1 2
1 3
2 3
```

Sample Output
```text
2.0
3.0
2.5
```
\(1\le n,m\le 500,000\)，\(s!=t\)
### Solution
首先不难发现，如果Elephant某一步是朝着t走的，那么一定不会走回来了；\
否则，Elephant一定会把整棵子树走完再回到当前点 \
走到一个s到t路径上的点时，Elephant会随机选择一个儿子走下去 \
这等价于随机一个儿子们的排列，然后按这个顺序走 \
那么s到t的路径上所有点显然一定会走到，以s为根时t子树中的点显然走不到 \
而其它点都有\({1\over 2}\)的概率会走到
$$Ans=s\to t路径点数\times 1+可能经过的子树大小(包括s子树)\times {1\over 2}$$
时间复杂度\(O(nlogn+m)\)
### Code
```cpp
#include<bits/stdc++.h>
using namespace std;
inline int read()
{
	bool si=0;
	char c='^';
	while(!isdigit(c=getchar()))
	si|=(c=='-');
	int x=c^48;
	while(isdigit(c=getchar()))
	x=(x<<1)+(x<<3)+(c^48);
	return si ? ~x+1 : x;
}
int n,m,x,y,tt,lca,p,link[500004],deep[500004],fa[500004][22],sz[500004];
struct cdcq{int y,ne;}e[1000004];
inline void dfs(int x)
{
	sz[x]=1;
    for(int i=1;((1<<i)<=deep[x]);++i) fa[x][i]=fa[fa[x][i-1]][i-1];
    for(int i=link[x];i;i=e[i].ne)
      if(e[i].y!=fa[x][0])
      fa[e[i].y][0]=x,deep[e[i].y]=deep[x]+1,dfs(e[i].y),
	  sz[x]+=sz[e[i].y];
}
int LCA(int x,int y)
{
	if(deep[x]<deep[y]) swap(x,y);
//%%%%%%%%%%%%
	int dp=deep[x]-deep[y]-1;
	if(dp>=0)
	{
	  for(int i=20;~i;--i) if((1<<i)&dp) x=fa[x][i];
	  if(fa[x][0]==y){p=x; return y;}
	  x=fa[x][0];
	}
//%%%此处标记%%%
	for(int i=20;~i;--i)
	  if(fa[x][i]!=fa[y][i])
	  x=fa[x][i],y=fa[y][i];
	return x==y ? x : fa[x][0];
}
double Half,One;//数值*(1/2)  *1的部分
int main()
{
	freopen("tree.in","r",stdin);
	freopen("tree.out","w",stdout);
	n=read(),m=read();
	for(int i=1;i<n;++i)
	{
		x=read(),y=read();
		e[++tt]=(cdcq){y,link[x]},link[x]=tt;
		e[++tt]=(cdcq){x,link[y]},link[y]=tt;
	}
	dfs(1);
	while(m--)
	{
		x=read(),y=read();
		lca=LCA(x,y);
		Half=(n-(deep[x]+deep[y]-2*deep[lca]+1)
			 -(y==lca?(n-sz[p]-1):(sz[y]-1)));
		One=deep[x]+deep[y]-2*deep[lca]+1;
		printf("%.1f\n",One+Half/2);
	}
	return 0;
}
```
## 2.最小质因数
### Description
Elephant精通数数，它想让你帮他算出\([1,n]\)中所有合数的最小质因数的\(k\)次方和。

Input \
一行两个整数\(n\),\(k\)

Output \
输出一行一个整数表示答案，对\(2^{64}\)取膜

Sample Input 1
```text
10 1
```

Sample Output 1
```text
11
```

Sample Input 2
```text
10 2
```

Sample Output 2
```text
25
```
\(1\le n\le 2\times 10^{11}\)，\(1\le k\le 10^9\)
### Solution
*此题细讲思路* \
眼瞎没看到合数!!!!!! \
如果暴力线性筛20分 \
显然\(n\)以内的所有合数的最小质因数不会超过\(\sqrt n\) \
筛出\(\sqrt n\)以内所有素数，考虑计算每个素数对答案的贡献 \
设定阀值\(w\)，枚举素数\(pri[i]\)

**First.当\(pri[i]\le w\)时**，考虑容斥 \
设\(f(x,i)\)表示\(\le x\)的数中最小质因数为\(pri[i]\)的数的个数(注意不是合数的个数) \
举例：
$$f(x,1)=\lfloor \frac x2\rfloor​$$
$$f(x,2)=\lfloor {x\over 3} \rfloor -\lfloor {x\over 6}\rfloor​$$
$$f(x,3)=\lfloor {x\over 5}\rfloor -\lfloor {x\over 10}\rfloor -\lfloor {x\over 15}\rfloor +\lfloor {x\over 30}\rfloor $$
推得：
$$f(x,i)=\left\lfloor {x\over pri[i]}\right\rfloor - \sum_{j=1}^{i-1}f(\left\lfloor {x\over pri[i]}\right\rfloor ,j)​$$
记忆化搜索即可，个数为\(f(n,i)-1\)（\(pri[i]\)本身不算）

**Second.当\(pri[i]&gt;w\)时**
此时\(\left\lfloor {n\over pri[i]}\right\rfloor \)较小 \
开\(s\)记录\(\le \lfloor{n\over w}\rfloor\)的每个数是否存在比当前\(pri[i]\)更小的质因数 \
也算是筛法吧 统计与更新答案具体细节见代码>_<
### Code
*3.8s勉强卡过*
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef unsigned long long ull;
const int w=1000;
ll n,k,sum,t,g[10004][1004];
ull ans;
int pri[50000],sq,tt;
bool s[200000005];
inline ull power(ull a)
{
	ull r=1;
	for(ll b=k;b;b>>=1,a*=a)
	  if(b&1) r*=a;
	return r;
}
inline ll f(ll x,int p)
{
	if(x<=10000&&g[x][p]) return g[x][p];
	ll r=x/pri[p],d=r;
	for(register int i=1;i<p;++i)
	{
		if((ll)pri[i]*pri[p]>x) break;
		r-=f(d,i);
	}
	if(x<=10000) g[x][p]=r;
	return r;
}
int main()
{
	freopen("prime.in","r",stdin);
    freopen("prime.out","w",stdout);
	scanf("%lld%lld",&n,&k);
	sq=sqrt(n); sum=n/w-1;
	for(register int i=2;i<=sq;++i) if(!s[i])
	{
		pri[++tt]=i;
		for(register int j=i+i;j<=sq;j+=i) s[j]=1;
	}
	memset(s,0,sq+1);
	for(register int i=1;i<=tt;++i)
	{
		if(pri[i]<=w) ans+=(f(n,i)-1)*power(pri[i]);
		else
		{
			for(ll j=n/pri[i]+1;j<=t;++j)
			  if(!s[j]) --sum;
			ans+=sum*power(pri[i]);
		}
		t=n/max(w,pri[i]);
		for(ll j=pri[i];j<=t;j+=pri[i]) if(!s[j]) s[j]=1,--sum;
	}
	cout<<ans;
	return 0;
}
```
## 3.路径
### Description
Elephant有一张n个点m条边的无向连通图，它想知道有多少条长度不小于k的简单路径

Input \
第一行三个整数n,m,k \
接下来m行每行两个整数表示一条边

Output \
输出一行一个整数表示答案

Sample Input
```text
5 5 2
1 3
2 4
3 5
4 1
5 2
```

Sample Output
```text
20
```
\(1\le k\le n\le 100,000\)，\(n-1\le m\le n\)
### Solution
[BZOJ3648寝室管理](https://darkbzoj.cf/problem/3648) 点分治裸题 \
点分治统计树上的情况，然后单独考虑经过剩下那条边的答案 \
在环上按顺序枚举一个端点 \
用树状数组维护扣除后的其他端点经过那条边到这个端点的距离 \
时间复杂度\(O(nlog^2n+nlogn)\)
### Code
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100010;
typedef long long ll;
inline int read()
{
	bool si=0;
	char c='^';
	while(!isdigit(c=getchar()))
	si|=(c=='-');
	int x=c^48;
	while(isdigit(c=getchar()))
	x=(x<<1)+(x<<3)+(c^48);
	return si ? ~x+1 : x;
}
bool ok[N<<1];
int n,m,K,x,y,Exa,Exb,tt=1,size,rot,p,sz[N],fa[N],tag[N],link[N];
int to[N],dis[N],way[N],cnt; bool in[N];
ll bit[N],ans;
struct cdcq{int y,ne;}e[N<<1];
inline int getfa(int x){return x==fa[x]?x:fa[x]=getfa(fa[x]);}
inline void add(int x){for(;x<=n;x+=x&-x)if(tag[x]!=p) tag[x]=p,bit[x]=1;else ++bit[x];}
inline void del(int x){for(;x<=n;x+=x&-x) --bit[x];}
inline ll sum(int x)
{
	if(x<=0) return 0;
	ll r=0;
	for(;x;x-=x&-x) if(tag[x]==p)
	r+=bit[x];
	return r;
}
inline void firot(int x,int pr)
{
	sz[x]=1; int f=0;
	for(int i=link[x];i;i=e[i].ne)
	if(ok[i]&&e[i].y!=pr)
	{
		firot(e[i].y,x);
		sz[x]+=sz[e[i].y];
		if(sz[e[i].y]>f) f=sz[e[i].y];
	}
	f=max(f,size-sz[x]);
	if(f<sz[0]) sz[0]=f,rot=x;
}
void dfscal(int x,int pr,int dep)
{
	ans+=sum(n)-sum(K-dep-1);
	for(int i=link[x];i;i=e[i].ne)
	  if(ok[i]&&e[i].y!=pr) dfscal(e[i].y,x,dep+1);
}
void dfsadd(int x,int pr,int dep)
{
	add(dep+1);
	for(int i=link[x];i;i=e[i].ne)
	  if(ok[i]&&e[i].y!=pr) dfsadd(e[i].y,x,dep+1);
}
void Solve(int x)
{
	++p,add(1);
	for(int i=link[x];i;i=e[i].ne)
	  if(ok[i]) dfscal(e[i].y,x,1),dfsadd(e[i].y,x,1);
	for(int i=link[x];i;i=e[i].ne)
	  if(ok[i]) ok[i^1]=0,sz[rot=0]=size=sz[e[i].y],firot(e[i].y,0),
	  			Solve(rot);
}

void Path(int x,int pr,int dep)
{
	to[x]=pr,add(dis[x]=dep);
	for(int i=link[x];i;i=e[i].ne)
	  if(e[i].y!=pr) Path(e[i].y,x,dep+1);
}
void Tdel(int x,int pr)
{
	del(dis[x]);
	for(int i=link[x];i;i=e[i].ne)
	  if(e[i].y!=pr&&!in[e[i].y]) Tdel(e[i].y,x);
}
void Tcal(int x,int pr,int dep)
{
	ans+=sum(n)-sum(K-dep-1);
	for(int i=link[x];i;i=e[i].ne)
	  if(e[i].y!=pr&&!in[e[i].y]) Tcal(e[i].y,x,dep+1);
}
int main()
{
	freopen("path.in","r",stdin);
	freopen("path.out","w",stdout);
	sz[0]=size=n=read(),m=read(),K=read();
	for(int i=1;i<=n;++i) fa[i]=i;
	for(int i=1;i<=m;++i)
	{
		x=read(),y=read();
		if(getfa(x)==getfa(y)) Exa=x,Exb=y;
		else
		{
			fa[fa[x]]=fa[y];
			e[++tt]=(cdcq){y,link[x]},link[x]=tt,ok[tt]=1;
			e[++tt]=(cdcq){x,link[y]},link[y]=tt,ok[tt]=1;
		}
	}
	firot(1,0);
	Solve(rot);
	if(Exa)
	{
		++p,Path(Exa,0,1);
		for(int i=Exb;i;i=to[i]) in[way[++cnt]=i]=1;
		for(int i=1;i<cnt;++i) Tdel(way[i],0),Tcal(way[i],0,i);
	}
	printf("%lld",ans);
	return 0;
}
```