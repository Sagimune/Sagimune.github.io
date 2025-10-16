+++
date = '2019-02-15T22:02:26+08:00'
draft = false
title = '洛谷4980 Polya定理'
tags = ['群论']
+++
{{< katex >}} {{< std >}}
## Description
给定一个\(n\)个点，\(n\)条边的环，有\(n\)种颜色，给每个顶点染色\
问有多少种`本质不同`的染色方案\
答案对\(1e9+7\)取模\
`本质不同`：不能通过旋转与别的染色方案相同
## Solution
Polya定理： 
$$L={1\over |G|}\sum_{i=1}^{|G|}m^{C(a_i)}$$
此题\(|G|=m=n\)\
旋转\(a_i\)(每次转\(i\)个点)的循环节长度为\({lcm(n,i)\over i}\)\
于是\(C(a_i)={n\over 循环节长度}=gcd(n,i)\)
$$Ans={1\over n}\sum m^{gcd(n,i)}​$$
注意到所有项的底数全为\(m\)，考虑枚举\(gcd(n,i)\)优化\
注意到使\(d=gcd(n,i)\)的数\(i\)有\(\varphi ({n\over d})\)个\
\(\therefore\)
$$Ans=\sum_{d|n}\varphi (d)\times n^{{n\over d}-1}$$
## Code
```cpp
#include<bits/stdc++.h>
using namespace std;
const int P=1e9+7;
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
int n,ans;
inline int power(int b)
{
	int r=1;
	for(int a=n;b;b>>=1,a=1ll*a*a%P)
	  if(b&1) r=1ll*r*a%P;
	return r;
}
inline int phi(int x)
{
	int r=x;
	for(int i=2;i*i<=x;++i) if(x%i==0)
	{
		r=1ll*r/i*(i-1);
		while(x%i==0) x=x/i;
	}
	return x>1 ? 1ll*r/x*(x-1) : r;
}
int main()
{
	int qwq=read();
	while(qwq--)
	{
		n=read(),ans=0;
		for(int i=1;i*i<=n;++i) if(n%i==0)
		{
			(ans+=1ll*phi(i)*power(n/i-1)%P)%=P;
			if(i*i!=n) (ans+=1ll*phi(n/i)*power(i-1)%P)%=P;
		}
		printf("%d\n",ans);
	}
}
```