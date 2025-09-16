+++
date = '2019-03-01T15:48:42+08:00'
draft = false
title = 'CF938G Shortest Path Queries'
tags = ['线段树','分治','启发式合并']
+++
{{< katex >}} {{< copy-tex >}}
## Description
有一张\(n\)个点\(m\)条边的无向带边权图，\(Q\)次操作：
1. 插入一条边
2. 删除一条边
3. 询问从\(s\)到\(t\)的`异或最短路`

\(n,m,Q≤200,000\)
## Soluation
此题模板与[AHOI2013 连通图](/oi/ahoi2013-connectivity-diagram/)基本相似，数据处理方式不同\
`异或最短路`不一定是最短路，思考：
1. 走完一段再走回来，对答案无影响
2. 基于1.，连通图内所有环都可取或不取，用线性基维护

用非路径压缩的并查集维护点的联系，`b[x].fa`与`x`必连通\
去掉所有环，就变成了有唯一路径的树，真正的最佳路径的值和由`^`线性基得到\
则树上\(t\)路径`^`值可转化为\(t\)到根路径`^`值的`^`，用`b[x].f`维护
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
#define MP make_pair
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
struct cdcq{int u,v,w,bg,ed;}e[400004];
struct chty
{
	int B[31];
	inline void ins(int x)
	{
		for(int i=30;~i;--i) if(x&(1<<i))
		{
			if(!B[i]) return (void)(B[i]=x);
			x^=B[i];
		}
	}
	inline void query(int x){for(int i=30;~i;--i)if((x^B[i])<x) x^=B[i]; printf("%d\n",x);}
}_;
int n,m,tt,x,y,v,Time,qx[200001],qy[200001];
struct DisSet{int dep,fa,f;}b[200001];
map<pair<int,int>,int> Map;
vector<int> T[800004];
void updata(int x,int l,int r,int p)
{
	if(e[p].bg<=l&&r<=e[p].ed) return (void)T[x].push_back(p);
	int mid=(l+r)>>1;
	if(e[p].bg<=mid) updata(x<<1,l,mid,p);
	if(e[p].ed>mid) updata(x<<1|1,mid+1,r,p);
}
stack<DisSet> S; int top;
inline int getfa(int x){return x==b[x].fa?x:getfa(b[x].fa);}
inline int getdis(int x){return x==b[x].fa?0:b[x].f^getdis(b[x].fa);}
void Sol(int x,int l,int r,chty G)
{
	int tp=top,X,Y,V;
	for(int i=T[x].size()-1;~i;--i)
	{
		X=getfa(e[T[x][i]].u),Y=getfa(e[T[x][i]].v),V=e[T[x][i]].w;
		V^=getdis(e[T[x][i]].u)^getdis(e[T[x][i]].v);
		if(X==Y) G.ins(V);
		else
		{
			S.push(b[X]),S.push(b[Y]); top+=2;
			if(b[X].dep>b[Y].dep) swap(X,Y);
			b[X].fa=Y,b[X].f=V,b[Y].dep=max(b[Y].dep,b[X].dep+1);
		}
	}
	if(l==r) G.query(getdis(qx[r])^getdis(qy[r]));
	else
	{
		int mid=(l+r)>>1;
		Sol(x<<1,l,mid,G),Sol(x<<1|1,mid+1,r,G);
	}
	for(DisSet w;top>tp;S.pop(),--top){w=S.top();b[w.fa]=w;}
}
int main()
{
	n=read(),m=read();
	for(int i=1;i<=n;++i) b[i].fa=i;
	for(int i=1;i<=m;++i)
	{
		x=read(),y=read(),v=read();
		e[++tt]=(cdcq){x,y,v,1,-1};
		Map[MP(x,y)]=tt;
	}
	for(int qwq=read();qwq;--qwq)
	{
	  	int Type=read();x=read(),y=read();
	  	if(Type==1)
	  	{
	  		v=read();
	  		e[++tt]=(cdcq){x,y,v,Time+1,-1};
	  		Map[MP(x,y)]=tt;
	    }
	  	else if(Type==2) e[Map[MP(x,y)]].ed=Time;
	  	else qx[++Time]=x,qy[Time]=y;
	}
	for(int i=1;i<=tt;++i) if(e[i].ed<0) e[i].ed=Time;
	for(int i=1;i<=tt;++i) if(e[i].bg<=e[i].ed) updata(1,1,Time,i);
	Sol(1,1,Time,_);
	return 0;
}
```