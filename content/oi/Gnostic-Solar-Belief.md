+++
date = '2019-08-28T18:34:48+08:00'
lastmod = '2019-08-28T19:30:40+08:00'
draft = false
title = '灵知的太阳信仰'
tags = ['线段树']
+++
{{< lead >}}
\(\qquad\)在炽热的核熔炉中，居住着一位少女，名为灵乌路空。\
\(\qquad\)据说，从来没有人敢踏入过那个熔炉，因为人们畏缩于空所持有的力量——核能。\
\(\qquad\)核焰，可融真金。
{{< /lead >}}
{{< katex >}}
<script type="module" src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/copy-tex.mjs" integrity="sha384-bVEnwt0PtX+1EuJoOEcm4rgTUWvb2ILTdjHfI1gUe/r5fdqrTcQaUuRdHG2DciuQ" crossorigin="anonymous"></script>
## Description

\(\qquad\)每次核融的时候，空都会选取一些原子，排成一列。然后，她会将原子序列分成一些段，并将每段进行一次核融。 一个原子有两个属性：质子数和中子数。 每一段需要满足以下条件：
* 同种元素会发生相互排斥，因此，同一段中不能存在两个质子数相同的原子
* 核融时，空需要对一段原子加以防护，防护罩的数值等于这段中最大的中子数。换句话说，如果这段原子的中子数最大为\(x\)，那么空需要付出\(x\)的代价建立防护罩。求核融整个原子序列的最小代价和

Input

第一行一个正整数\(N\)表示原子的个数。 接下来\(N\)行，每行两个正整数\(p_i\)和\(v_i\)，表示第\(i\)个原子的质子数和中子数。

Output

输出一行一个整数，表示最小代价和。

Sample Input
```text
5 
3 11 
2 13 
1 12 
2 9 
3 13
```
Sample Output
```text
26
```
## Solution

dp方程：
$$
    f[i] = Min\{f[j]+Max(v[j+1],\cdots v[i])\}
$$

### Multiset:

因为\(Max\)包含了到\(i\)的所有\(v\)，所以\(Max\)必须是递减的\
维护\(L[;]\)表示在位置\(i\)所能取到最左端的位置\
对于每个\(i\)的加入:
1. 检查队头是否全部在\(L[i]\)外，若是则出队
2. 检查队尾\(data\)是否比\(v[i]\)小，若是则出队
3. 将\(i\)入队
4. 当队里不止一个值时，考虑队头可能有部分在\(L[i]\)外，更改即可

### Segment tree:

不需要再管队头了，因为查询时可以限定范围\
线段树的子节点\(j\)维护了\(f[j]+Max(v[j+1],…v[i])\)的值\
出队队尾时直接给原区间加上更新后的差值
## Code
### Multiset
```cpp
const int N=100010;
multiset<int> t;
int n,L[N],p[N],v[N],pr[N];
int S=1,T,pos[N],data[N],sum[N],f[N];
signed main()
{
	freopen("array.in","r",stdin);
	freopen("array.out","w",stdout);
	n=read();
	for(int i=1;i<=n;++i)
	{
		p[i]=read(),v[i]=read();
		L[i]=max(L[i-1],pr[p[i]]+1);
		pr[p[i]]=i;
	}
	for(int i=1,k=0;i<=n;k=i++)
	{
		while(S<T&&pos[S+1]<L[i])
		  t.erase(t.find(sum[S++]));
		while(S<=T&&v[i]>data[T])
		  k=pos[T],
		  t.erase(t.find(sum[T--]));
		pos[++T]=k,data[T]=v[i];
		if(S^T)
		{
			t.erase(t.find(sum[S]));
			sum[T]=f[pos[T]]+data[T];
			t.insert(sum[T]);
		}
		sum[S]=f[L[i]-1]+data[S];
		t.insert(sum[S]);
		f[i]=*t.begin();
	}
	printf("%d",f[n]);
	return 0;
}
```

### Segment tree

```cpp
const int N=100010;
int n,L[N],p[N],v[N],pr[N];
int T,pos[N],data[N],ans;
struct chty{int v,tag;}t[N<<2];
inline void pushdown(int x)
{
	t[x<<1].v+=t[x].tag;
	t[x<<1|1].v+=t[x].tag;
	t[x<<1].tag+=t[x].tag;
	t[x<<1|1].tag+=t[x].tag;
	t[x].tag=0;
}
inline void add(int x,int l,int r,int L,int R,int P)
{
	if(r<L||l>R) return;
	if(L<=l&&R>=r)
	{
		t[x].v+=P;
		t[x].tag+=P;
		return;
	}
	if(t[x].tag) pushdown(x);
	int mid=(l+r)>>1;
	add(x<<1,l,mid,L,R,P);
	add(x<<1|1,mid+1,r,L,R,P);
	t[x].v=min(t[x<<1].v,t[x<<1|1].v);
}
inline int ask(int x,int l,int r,int L,int R)
{
	if(L<=l&&R>=r) return t[x].v;
	if(t[x].tag) pushdown(x);
	int mid=(l+r)>>1;
	if(R<=mid) return ask(x<<1,l,mid,L,R);
	if(L>mid) return ask(x<<1|1,mid+1,r,L,R);
	return min(ask(x<<1,l,mid,L,R),ask(x<<1|1,mid+1,r,L,R));
}
signed main()
{
	freopen("array.in","r",stdin);
	freopen("array.out","w",stdout);
	n=read();
	for(int i=1;i<=n;++i)
	{
		p[i]=read(),v[i]=read();
		L[i]=max(L[i-1],pr[p[i]]+1);
		pr[p[i]]=i;
	}
	for(int i=1;i<=n;++i)
	{
		add(1,0,n,i-1,i-1,v[i]);
		for(;T&&data[T]<=v[i];--T)
		if(data[T]<v[i]&&pos[T]>pos[T-1])
		  add(1,0,n,pos[T-1],pos[T]-1,v[i]-data[T]);
		pos[++T]=i,data[T]=v[i];
		ans=L[i]<=i ? ask(1,0,n,L[i]-1,i-1) : 0;
		add(1,0,n,i,i,ans);
	}
	printf("%d",ans);
	return 0;
}
```