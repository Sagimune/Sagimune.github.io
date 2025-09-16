+++
date = '2018-08-23T14:16:51+08:00'
draft = false
title = 'Number Theory P1'
tags = ['数论']
+++
{{< katex >}}
## 费马小定理
若 \(p\) 是质数，则对于任意整数 \(a\)，有 \(a^p\equiv a \pmod p\)\
则 \(a^{p-1}\equiv 1 \pmod p\)
## 欧拉定理
若正整数 \(a\)，\(n\) 互质，则 \(a^{\varphi(n)}\equiv 1\pmod n\) \
证明：\
设 \(u=\varphi(n)\) 设 \(n\) 的简化剩余系为\(\lbrace \overline {a_1},\overline {a_2},\overline {a_3},···,\overline {a_u} \rbrace\) \
对于 \(\forall a_i,a_j\;(i\neq j \to a_i\neq a_j)\) 若 \(a\times a_i \equiv a\times a_j\pmod n\) 则 \(a \times (a_i - a_j)\equiv 0\pmod n\) \
因为 \(a,n\) 互质，所以 \(a_i - a_j\equiv 0\pmod n\) \
即 \(a_i\equiv a_j\) 显然不成立 \
**故当\(a_i\neq a_j\)时，\(aa_i,aa_j\)也代表不同的同余类**

又因为简化剩余系关于模 \(n\) 乘法封闭，故 \(\overline {aa_i}\) 也在简化剩余系集合中
因此，集合\(\lbrace \overline {a_1},\overline {a_2},···,\overline {a_u} \rbrace\)与集合\(\lbrace \overline {aa_1},\overline {aa_2},···,\overline {aa_u} \rbrace\)都能表示\(n\)的化简剩余系 \
综上所述：
$$a^u \times a_1a_2···a_u\equiv (aa_1)(aa_2)···(aa_u)\equiv a_1a_2···a_u\pmod n$$
因此 \(a^{\varphi(n)}\equiv 1\pmod n\)
当 \(p\) 是质数时，\(\varphi (p)=p-1\)，并且只有 \(p\) 的倍数与 \(p\) 不互质

所以，只要 \(a\) 不是 \(p\) 的倍数，就有 \(a^{p-1}\equiv 1 \pmod p\) 就是费马小定理的变形 \
若 \(a\) 是 \(p\) 的倍数，费马小定理显然成立

推论 若正整数 \(a\)，\(n\) 互质，则对于任意正整数 \(b\)，有 \(a^b \equiv a^{b\mod\varphi(n)} \pmod n\)
## 扩展欧几里得法
```cpp
int exgcd(int a,int b,int &x,int &y)
{
    if( !b ) {x = 1, y = 0; return a;}
    int d = exgcd(b,a%b,x,y);
    int z = x; x = y, y = z-y*(a/b);
    return d;
}
```
上述方程求出 \(ax + by = gcd(a,b)\) 的一组特解 \(x_0\)，\(y_0\) ,并返回 \(a\)，\(b\) 的最大共约数 \(d\)

## 乘法逆元
若 \(b\)，\(m\) \(\in \mathbb{Z}\) 且互质，并且 \(b|a\) ，则存在整数 \(x\) ，使得\(a/b\equiv a \times x\pmod m\) \
则称 \(x\) 为 \(b\) 模 \(m\) 乘法逆元，记为 \(b^{-1}\pmod m\)
若保证 \(b\)，\(m\) 互质，那么乘法逆元可通过求解同余方程 \(b\times x\equiv 1\pmod m\) 得到
### 线性筛逆元
\(1,2,3,···,N\) 关于 \(p\) 的逆元
```cpp
inv[1] = 1;
for(int i = 2; i <= N; i++)
  inv[i] = inv[mod % i] * (mod - mod / i) % mod;
```
### 阶乘的逆元
```cpp
inv[maxn] = power( fac[maxn] , mod - 2 );
for (ll i = maxn - 1; i > 0; i--)
  inv[i] = (inv[i + 1] * (i + 1)) % mod;
```
## 组合数Lucas法
```cpp
ll C(ll m,ll n)
{
    if (n == m || m == 0) return 1;
    if (m > n || n == 0) return 0;
    return fac[n] * inv[m] % mod * inv[n-m] % mod;
}
ll lucas(ll m,ll n)
{
    if (n < mod) return C(m,n) % mod;
    return lucas (m % mod , n % mod) * lucas(m / mod , n / mod) % mod;
}
```