+++
date = '2019-02-25T16:14:38+08:00'
draft = false
title = 'SPOJ Query on a Tree VI'
+++
{{< katex >}} {{< copy-tex >}}
## Description
有一棵\(n\)个点的树，点有黑白两种颜色。\(m\)次操作：
1. 询问一个点所在的同色连通块的大小
2. 修改一个点的颜色

\(n,m\le 100,000\)
## Soluation
每个点记录只考虑这个点的子树时同色连通块的大小 \
询问时找到该点所在同色连通块深度最小的点，该点记录的值就是答案 \
用**树状数组**求前缀和储存答案 \
方便之处在于这样修改一条链时只需修改两个单点 \
每次修改只会影响一条链 \
用`find(x)`找到该点所在同色连通块深度最小的点 \
利用重链的性质 \
当找到一条不完全是同一个颜色的重链时**二分查找** \
时间复杂度\(O(mlog^2n)\) \
注意事项： `fa[1]=1` 不然可能会跳到0而TLE！！！！ \
*~~惨败此处~~*
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100001;
inline int read()
{
	bool si=0;
	char c='*';
	while(!isdigit(c=getchar()))
	si|=(c=='-');
	int x=c^48;
	while(isdigit(c=getchar()))
	x=(x<<1)+(x<<3)+(c^48);
	return si ? ~x+1 : x;
}
int n,tt,tot,lin[N],deep[N],col[N];
int sz[N],fa[N],son[N],top[N],dfn[N],que[N];
struct cdcq{int y,ne;}e[N<<1];
int T[3][N];
inline void add(int c,int x,int v){for(;x<=n;x+=x&-x) T[c][x]+=v;}
inline int sum(int c,int x){int r=0;for(;x;x-=x&-x)r+=T[c][x];return r;}
inline void fiso(int x)
{
    sz[x]=1;
    for(register int i=lin[x];i;i=e[i].ne)
    if(e[i].y!=fa[x])
    {
        deep[e[i].y]=deep[x]+1;
        fa[e[i].y]=x;
        fiso(e[i].y);
        if(sz[e[i].y]>sz[son[x]]) son[x]=e[i].y;
        sz[x]+=sz[e[i].y];
    }
}
inline void fitp(int x,int tp)
{
    dfn[x]=++tot,que[tot]=x,top[x]=tp;
    if(son[x]) fitp(son[x],tp);
    for(register int i=lin[x];i;i=e[i].ne)
    if(e[i].y!=fa[x]&&e[i].y!=son[x])
      fitp(e[i].y,e[i].y);
}
inline void updata(int x,int y,int v,int c)
{
	while(top[x]!=top[y])
	{
		if(deep[top[x]]<deep[top[y]]) swap(x,y);
		add(c,dfn[top[x]],v);
		add(c,dfn[x]+1,-v);
		x=fa[top[x]];
	}
	if(deep[x]>deep[y]) swap(x,y);
	add(c,dfn[x],v),add(c,dfn[y]+1,-v);
}
inline int Equin(int l,int r,int c)//二分查找
{
	int mid,ge;
	while(l<r)
	{

		mid=(l+r)>>1;
		ge=sum(2,r)-sum(2,mid-1);
		if((c&&!ge)||(!c&&ge==r-mid+1)) r=mid;
		else l=mid+1;
	}
	return que[r];
}
inline int find(int x)
{
	int c=col[x],ge;//黑点个数
	while(top[x]!=1)
	{
		ge=sum(2,dfn[x])-sum(2,dfn[top[x]]-1);
		if((c&&!ge)||(!c&&ge==dfn[x]-dfn[top[x]]+1))
		  if(c==col[fa[top[x]]]) x=fa[top[x]];
		  else return top[x];
		else return Equin(dfn[top[x]],dfn[x],c);
	}
	return Equin(dfn[1],dfn[x],c);
}
int main()
{
	n=read();
	for(int i=1,x,y;i<n;++i)
	{
		x=read(),y=read();
		e[++tt]=(cdcq){y,lin[x]},lin[x]=tt;
		e[++tt]=(cdcq){x,lin[y]},lin[y]=tt;
	}
	fa[1]=1,fiso(1),fitp(1,1); add(1,1,1);
	for(int i=1;i<=n;++i) add(0,dfn[i],sz[i]),add(0,dfn[i]+1,-sz[i]),add(2,i,1);
	for(int qwq=read(),x;qwq;--qwq)
	{
		if(read())
		{
		  x=read();
		  if(x>1) updata(fa[find(x)],fa[x],-sum(col[x],dfn[x]),col[x]);
		  add(2,dfn[x],(col[x]^=1)?-1:1);
		  if(x>1) updata(fa[find(x)],fa[x],sum(col[x],dfn[x]),col[x]);
		}
		else
		{
		  x=read();
		  printf("%d\n",sum(col[x],dfn[find(x)]));
		}
	}
	return 0;
}
```