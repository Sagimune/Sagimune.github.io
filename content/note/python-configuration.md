+++
date = '2025-10-16T19:55:15+08:00'
draft = false
title = 'Python配置笔记'
+++
{{< std >}}
## Python2配置

### python2安装
```bash
sudo apt update && sudo apt upgrade
sudo apt install -y build-essential checkinstall libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev

wget https://www.python.org/ftp/python/2.7.18/Python-2.7.18.tgz
tar xzf Python-2.7.18.tgz
cd Python-2.7.18
./configure --enable-optimizations
make
sudo make install

python -V
```
### pip2.7安装
```bash
sudo apt install curl

curl https://bootstrap.pypa.io/pip/2.7/get-pip.py -o get-pip.py

sudo python2.7 get-pip.py

pip2.7 --version
```

### SSL模块缺失
安装OpenSSL 1.1.1 （该版本能够配合 Python 2.7.18）
```bash
curl https://www.openssl.org/source/old/1.1.1/openssl-1.1.1w.tar.gz | tar -zx
./config --prefix=/usr/local/openssl/1.1.1
make -j$(nproc) 
sudo make install
```
修改python源代码根目录下setup.py
```python
#Detect SSL support for the socket module (via _ssl)
        search_for_ssl_incs_in = [
                              '/usr/local/ssl/include',
                              '/usr/local/openssl/1.1.1/include', #增加该行内容
                              '/usr/contrib/ssl/include/'
                             ]
```