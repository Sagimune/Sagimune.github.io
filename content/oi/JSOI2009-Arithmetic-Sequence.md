+++
date = '2019-02-17T15:28:18+08:00'
draft = false
title = 'JSOI2009 等差数列'
tags = ['线段树']
+++
{{< katex >}}
<script type="module" src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/copy-tex.mjs" integrity="sha384-bVEnwt0PtX+1EuJoOEcm4rgTUWvb2ILTdjHfI1gUe/r5fdqrTcQaUuRdHG2DciuQ" crossorigin="anonymous"></script>
## Description
给定一个长度为\(N\)的序列，\(Q\)次操作：
1. 每次给一个区间加上一个等差数列
2. 询问一个区间最少能划分成几个等差数列

\(N,Q\le 100,000\)
## Solution
用线段树维护**差分数组**，从而将操作一转换成区间加 \
\(N=1\)时无差分，特判 \
设在\([a,b]\)增加首相为\(a_1\)，公差为\(d\)的等差数列 \
则：\(b[l-1]+=a_1\)，\(b[l…r-1]+=d\)，\(b[r]-=(r-l)\times d+a_1\) \
此题最毒瘤的地方是区间如何合并，其余的和普通线段树做法一样 \
考虑重载\(+\)运算符：\
开Struct`qwq`，其中：
* `s`：区间中的等差数列段数
* `ls/rs`：区间左/右剩下的零散数个数
* `l/r`：区间左/右端的数值
* `sz`：区间长度

答案为在线段树上查询 \(l,r-1\) \
最劣为`((r-l+1)+1)/2` \
或者是`ans.s`\(+\)`(ans.ls+1)/2`\(+\)`(ans.rs+1)/2`
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long intt;
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
struct qwq
{
	int s,ls,rs,sz;
	intt l,r;
	friend qwq operator + (qwq a,qwq b)
	{
		qwq c=(qwq){a.s+b.s,a.ls,b.rs,a.sz+b.sz,a.l,b.r};
		bool T=(a.r==b.l);//能不能合并
		if(!a.s&&!b.s)
		{
			if(!T) c.ls=c.rs=c.sz;
			else --c.ls,--c.rs,++c.s;
			return c;
		}
		else if(!a.s)
		{
			if(!T) c.ls=a.sz+b.ls;
			else
			{
				--c.ls;
				if(b.ls) c.s+=(b.ls-1)/2+1;
			} return c;
		}
		else if(!b.s)
		{
			if(!T) c.rs=a.rs+b.sz;
			else
			{
				--c.rs;
				if(a.rs) c.s+=(a.rs-1)/2+1;
			} return c;
		}

		if(!a.rs&&!b.ls)
		{
			if(T) --c.s;
			return c;
		}
		else if(!a.rs)
		{
			c.s+=T?(b.ls-1)/2:b.ls/2;
			return c;
		}
		else if(!b.ls)
		{
			c.s+=T?(a.rs-1)/2:a.rs/2;
			return c;
		}

		int S=(a.rs+b.ls)>>1;
		if(T) S=min(S,1+(a.rs-1)/2+(b.ls-1)/2);
		c.s+=S;
		return c;
	}
}w[400000];
char c;
int l,r,a,b,n,lazy[400000],que[100000];
inline void build(int x,int l,int r)
{
	if(l==r)
	{
		w[x]=(qwq){0,1,1,1,que[l],que[l]};
		return;
	}
	int mid=(l+r)>>1;
	build(x<<1,l,mid);
	build(x<<1|1,mid+1,r);
	w[x]=w[x<<1]+w[x<<1|1];
}
inline void down(int x)
{
	w[x<<1].l+=lazy[x],w[x<<1].r+=lazy[x];
	w[x<<1|1].l+=lazy[x],w[x<<1|1].r+=lazy[x];
	lazy[x<<1]+=lazy[x],lazy[x<<1|1]+=lazy[x];
	lazy[x]=0;
}
inline void updata(int x,int l,int r,int L,int R,intt p)
{
	if(r<L||l>R) return;
	if(l>=L&&r<=R){w[x].l+=p,w[x].r+=p,lazy[x]+=p;return;}
	if(lazy[x]) down(x);
	int mid=(l+r)>>1;
	if(L<=mid) updata(x<<1,l,mid,L,R,p);
	if(R>mid) updata(x<<1|1,mid+1,r,L,R,p);
	w[x]=w[x<<1]+w[x<<1|1];
}
inline qwq query(int x,int l,int r,int L,int R)
{
	if(L<=l&&R>=r) return w[x];
	if(lazy[x]) down(x);
	int mid=(l+r)>>1;
	if(R<=mid) return query(x<<1,l,mid,L,R);
	else if(L>mid) return query(x<<1|1,mid+1,r,L,R);
	else return query(x<<1,l,mid,L,mid)+query(x<<1|1,mid+1,r,mid+1,R);
}
int main()
{
	n=read()-1,l=read();
	for(int i=1;i<=n;++i) que[i]=(r=read())-l,l=r;
	int Q=read(); qwq T;
	if(!n)
	{
		while(Q--)
		{
			do c=getchar();while(c!='B');
			if(c=='B') puts("1");
		}
		exit(0);
	}
	build(1,1,n);
	while(Q--)
	{
		do c=getchar();while(c<'A'||c>'B');
		l=read(),r=read();
		if(c=='A')
		{
			a=read(),b=read();
			if(l>1) updata(1,1,n,l-1,l-1,a);
			if(l<=r-1) updata(1,1,n,l,r-1,b);
			if(r<=n) updata(1,1,n,r,r,-1ll*(r-l)*b-a);
		}
		else
		{
			if(l==r){puts("1"); continue;}
			else
			{
				T=query(1,1,n,l,r-1);
				int ans=(r-l+1+1)/2;
				if(!T.s) printf("%d\n",ans);
				else printf("%d\n",min(ans,T.s+(T.ls+1)/2+(T.rs+1)/2));
			}
		}
	}
	return 0;
}
```