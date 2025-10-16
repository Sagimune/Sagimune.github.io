+++
date = '2019-02-18T15:39:30+08:00'
draft = false
title = 'AHOI2013 连通图'
tags = ['线段树','分治','启发式合并']
+++
{{< katex >}} {{< copy-tex >}} {{< std >}}
## Description
给定一个\(n\)个点\(m\)条边的图，\(k\)次询问 \
求删掉给定的\(c\)条边后图是否连通 \
\(n,m,k\le 100,000\)，\(c\le 4\)
## Soluation
### 线段树分治
若是真的删边，不好做 \
转换为加边 \
记`Pre[x]`为\(x\)上一次被删的时间 \
将区间\([pre[x]+1,i-1]\)都记录上x \
线段树上每个点开Vector记录 \
\(c\le 4\)保证这样的段不会很多 \
用并查集维护连通块 \
由于需要支持撤销，不能路径压缩 \
使用启发式合并 \
到叶子节点时判断`fa[1].sz`是否等于\(n\) \
\(O((m+kc)log^2m)\)
### 取巧
任取一个生成树，给每条非树边随机一个权值 \
树边的权值是覆盖它的权值之和 \
如果有一个删去的边中有一个子集异或和为\(0\)，那么不连通 \
\(O(mlogm+kclogW)\)
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
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
int n,m,K,pre[200004],top;
struct DisSet{int fa,sz,dep;}b[200004];
struct Edge{int u,v;}e[200004];
vector<int> t[4400004];
stack<DisSet> S;
inline int getfa(int x){return b[x].fa==x?x:getfa(b[x].fa);}
inline void Insert(int x,int l,int r,int L,int R,int p)
{
    if(L<=l&&R>=r){t[x].push_back(p); return;}
    int mid=(l+r)>>1;
    if(L<=mid) Insert(x<<1,l,mid,L,R,p);
    if(R>mid) Insert(x<<1|1,mid+1,r,L,R,p);
}
inline void Sol(int x,int l,int r)
{
    int tp=top,X,Y;
    for(int i=t[x].size()-1;~i;--i)
    {
        X=getfa(e[t[x][i]].u),Y=getfa(e[t[x][i]].v);
        if(X==Y) continue;
        S.push(b[X]),S.push(b[Y]); top+=2;
        if(b[X].dep>b[Y].dep) swap(X,Y);
        b[X].fa=Y,b[Y].dep=max(b[Y].dep,b[X].dep+1);
        b[Y].sz+=b[X].sz;
    }
    if(l==r) puts(b[getfa(1)].sz==n?"Connected":"Disconnected");
    else
    {
        int mid=(l+r)>>1;
        Sol(x<<1,l,mid),Sol(x<<1|1,mid+1,r);
    }
    for(DisSet r;top>tp;S.pop(),--top){r=S.top();b[r.fa]=r;}//并查集还原
}
int main()
{
    n=read(),m=read();
    for(int i=1;i<=n;++i) b[i]=(DisSet){i,1,1};
    for(int i=1;i<=m;++i) e[i]=(Edge){read(),read()},pre[i]=1;
    K=read();
    for(int i=1,x;i<=K;++i)
      for(int qwq=read();qwq;--qwq)
      {
        if(pre[x=read()]<i) Insert(1,1,K,pre[x],i-1,x);
        pre[x]=i+1;
      }
    for(int i=1;i<=m;++i)
    if(pre[i]<=K) Insert(1,1,K,pre[i],K,i);
    Sol(1,1,K);
    return 0;
}
```