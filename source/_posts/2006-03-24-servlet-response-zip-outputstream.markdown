---
layout: post
title: "java.util.zip & Servlet实现动态打包网络传输"
date: 2006-03-24 14:39:56 +0800
comments: true
categories: 
---
> 建space以来来,第一次写技术文章,见笑
 
### 问题
我在写一个基于jsp/servlet的web应用程序,其中客户有一个需求,批量下载文件,当然首先需要先用java.util.zip打包(除了打包,没想到其他方法).
由于是事先不知道客户要下哪个目录下的文件,并且文件目录下的文件也是会变的,所有要求动态的打包.
 
### 方案
有两种方案   

1. 先将选定的的文件,打包放入临时文件夹,再让用户下载.   
2. 将选定的文件,边打包,边下载.
 
### 难点
1. 由于基于http协议的web是无连接的,将文件提供给用户下载,用户什么时候下载完成,服务器无法知道.而临时文件夹空间也是有限的,所以web服务器要把生成的zip文件删除.但要捕获到用户下载完成比较难.特别是文件传输中,用户突然把浏览器关闭.
2. 平常我们用zip类都是通过FileOutPutStream向磁盘写文件,没有通过网络向客户端写文件的,当然也不是说不可以,think in java中文第二版438页就说到"GZIP和ZIP程序库并非只能用来处理文件的压缩－他们当然可以压缩任何形式的数据，包括即将被传送至网络连线的数据。",遗憾的是Bruce Eckel没有留下事例代码.
 
### 解决
1. 其实要删除文件也不是没有方法,用Session Tracking,实现HttpSessionBindingListener接口的valueUnbound方法在移除session对象的时候web服务器会自动调用这个方法,可以在这里删除临时生成的文件.(由于比较烦琐,所以没有实现,改用第二种方案)
2. 通过HttpServletResponse的getOutputStream()方法获得ServletOutputStream,然后再得到ZipOutputStream对象就可以了,其他的和普通的文件读写一样.   
源代码:
{% codeblock lang:java %}
package done.servlet;
import java.io.*;
import java.util.*;
import java.util.zip.*;
import javax.servlet.*;
import javax.servlet.http.*;
public class ZipDownLoad extends HttpServlet {
 
 /**
 * Handles GET requests
 */
 public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  //设置响应头,MIMEtype告诉浏览器传送的文件类型
  response.setContentType( "application/x-zip-compressed" );
  //inline;参数让浏览器弹出下载窗口,而不是在网页中打开文件.filename设定文件名
  response.setHeader( "Content-Disposition" , "inline; filename=download.zip" );
  //通过response获得ServletOutputStream对象
  ServletOutputStream sos=response.getOutputStream();
  //获得ZipOutputStream对象
  ZipOutputStream out=new ZipOutputStream(new BufferedOutputStream(sos));  
  //得到要下载的文件对象
  BufferedInputStream in=new BufferedInputStream(new FileInputStream("c:\\grub.exe"));
  //在zip文件中新建一个grub.exe文件
  out.putNextEntry(new ZipEntry("grub.exe"));
  //逐字读出写入
  int c;
  while((c = in.read())!=-1){
   out.write(c);
  }
  in.close();
  out.close(); //这里一句一定要,要不就会打开文件出错
 }
 
 /**
 * Handles POST requests
 */
 protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
  this.doGet(request,response);
    }
 /**
 * Destroy the servlet
 */
 public void  destroy () {
 }
}
{% endcodeblock %}
### 参考
1. [使用Java实现网络传输数据的压缩](http://www.it023.com/software/develop/program/java/2004-04-06/1081241135d12639.html)
2. [jspSmartUpload上传组件](http://www.dwww.cn/new/2006391954281269.html)
3. Thinking in Java 中文第二版