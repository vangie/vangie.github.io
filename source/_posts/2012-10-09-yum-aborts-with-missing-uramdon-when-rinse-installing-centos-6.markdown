---
layout: post
title: "解决rinse安装CentOS 6报错找不到'/dev/urandom'的问题"
date: 2012-10-09 15:53
comments: true
categories: 
---
>Debian系统xen安装centos 6.3失败，报错找不到`/dev/urandom`。

### 错误如下
```
  File "/usr/lib64/python2.4/random.py", line 109, in seed
    a = long(_hexlify(_urandom(16)), 16)
OSError: [Errno 2] No such file or directory: '/dev/urandom'
```

<!-- more -->

### 解决方法
`vim /usr/lib/rinse/common/30-dev-urandom.sh`内容如下

	#!/bin/sh
	#
	#  Ensure the chroot has /dev/random and /dev/urandom
	#
	# Dan Kegel
	# --
	
	
	#
	#  Get the root of the chroot.
	#
	prefix=$1
	
	#
	#  Ensure it exists.
	#
	if [ ! -d "${prefix}" ]; then
	  echo "Serious error - the named directory doesn't 	exist."
	  exit
	fi
	
	#
	#  Ensure we have /dev
	#
	if [ ! -d "${prefix}/dev" ]; then
	    mkdir "${prefix}/dev"
	fi
	
	
	#
	#  Create the nodes
	#
	echo "  Creating random devices in /dev"
	if [ !  -e "${prefix}/dev/random" ]; then
	    mknod -m 666 "${prefix}/dev/random" c 1 8
	    chown root:root "${prefix}/dev/random"
	fi
	if [ !  -e "${prefix}/dev/urandom" ]; then
	    mknod -m 666 "${prefix}/dev/urandom" c 1 9
	    chown root:root "${prefix}/dev/urandom"
	fi

然后

```bash
chmod +x /usr/lib/rinse/common/30-dev-urandom.sh
```

重新执行`xen-create-image`命令即可
```bash
xen-create-image --hostname=yourHostName --ip=yourIP --dist=centos-6 --install-method=rinse --force --arch=amd64
```

###参考文献
1.[yum aborts with missing /dev/urandom at end of "rinse --arch amd64 --distribution centos-6"](http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=685640)