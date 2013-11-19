---
layout: post
title: "求最大色差颜色"
date: 2012-09-13 22:51
comments: true
categories: 
---
>对于一个给定的前景色，如何找到一个与之色差较大的背景色，使之醒目？

### 反色

对颜色值取反，比较简单的方法：`0xFFFFFF - $color`

```coffeescript
// coffeescript
invert = (color) ->
  "#" + ("000000" + (0xFFFFFF ^ parseInt(color.substring(1),16)).toString(16)).slice(-6);
```
      
但是当`$color = 0x808080`时,`$color ≈ 0xFFFFFF - $color`前景色和背景色非常接近，显然取反的方法有瑕疵。

<!-- more -->

### 何为色差
色差简单来说就是颜色的差别,定量表示的色知觉差异。从__明度__、__色调__和__彩度__这三种颜色属性的差异来表示。明度差表示深浅的差异，色调差表示色相的差异（即偏红或偏蓝等），彩度差表示鲜艳度的差异。通过明度(L)、色调(A)和彩度(B)表示的颜色模型，称为LAB颜色模型，区别于RGB和CMYK颜色模型。

__LAB的取值范围__

* L [0, 100]
* A [-128, 127]
* B [-128, 127]

### 如何计算色差

![色差计算公式](http://upload.wikimedia.org/math/9/1/0/910227e12a98c6df4664034d33c2e91c.png)
 ，其中![颜色1](http://upload.wikimedia.org/math/b/0/6/b06a11157eefd0439922bc2c5f390502.png)和![颜色2](http://upload.wikimedia.org/math/4/0/1/4013fe6a2bdda4d686baa791861d3db5.png)分别表示两个不同的LAB模型颜色。

### 求得与某一颜色的色差最大的颜色
根据上面的色差计算公式，对于一个给定的LAB颜色，计算出色差最大的颜色是很容易的。L1，a1和b1分别与对应取值范围的中值比较，小于中值取上界，大于中值去下届

	L2 = L1<50?100:0
	a2 = a1<0?127:-128
	b2 = b1<0?127:-128

但是计算机和常见程序设计语言的采用RGB模型表示颜色。所以需要先将RGB颜色转换成LAB颜色，计算出最大色差颜色的LAB表示法，然后再转换成RGB颜色。

__RGB -> LAB__

	L = (13933 * R + 46871 * G + 4732 * B) / 2^16
	a = 377 * (14503 * R - 22218 * G + 7714 * B) / 2^24 + 128
	b = 160 * (12773 * R + 39695 * G - 52468 * B) / 2^24 + 128

	
__LAB -> RGB__	

	R = L1 + (a1 * 100922 + b1 * 17790) / 2^23
	G = L1 - (a1 * 30176 + b1 * 1481) / 2^23
	B = L1 + (a1 * 1740 - b1 * 37719) / 2^23
	
真的有必要通过繁琐的步骤求出最大色差么，能不能简单的获得一个较大色差？

### 近似求法

如果我们略去RGB与LAB的转换，分别找出与R值，G值和B值的差值最大的R‘，G’和B‘也能取得较好的效果

	R' = R<128 ? 255 : 0
	G' = G<128 ? 255 : 0
	B' = B<128 ? 255 : 0

源码

``` coffeescript
//coffeescript
diff = (color) ->
  hex = parseInt(color.substring(1),16);
  r = if ( hex >> 16 ) > 128 then '00' else 'FF'
  g = if ( hex >> 8 & 0xFF ) > 128 then '00' else 'FF'
  b = if ( hex & 0xFF ) > 128 then '00' else 'FF'
  "#" + r + g + b
```

###参考文献

1. [Online calculator of color difference and color brightness difference](http://maestric.com/doc/color_brightness_difference_calculator)
2. [Wikipedia - Color difference](http://en.wikipedia.org/wiki/Color_difference)
3. [从RGB到Lab色彩空间的转换](http://hao.qinz.net/comments.php?y=08&m=07&entry=entry080727-033517)
