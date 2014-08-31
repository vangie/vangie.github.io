---
layout: post
title: "JYaml使用心得"
date: 2007-01-16 00:29:08 +0800
comments: true
categories: 
---
>前不久在《程序员》上看到了关于Yaml的介绍。
据说是现在Ruby下用的很火的配置文件。
在其官方站点有其对文件格式的一些简单介绍。
在sourceforge上也有两个开源的yaml配置文件的解析包JYaml和Yaml4J
另外在dev.java.net上有另一个解析包Jvyaml，由于找不到文档就没有进一步的研究。

公司的最近的一个项目需要从配置文件中读取结构化的数据，需要一个POJO类的反序列化。
于是迫不及待的想体验新技术，
虽然我不是第一个吃螃蟹的，但还是付出了不少的代价。

Yaml4J比较弱一点，只提供了Loader/Dumper方法。
相比之下,JYaml的提供的序列化和反序列化的方法多多了，
而且不但支持List和Map这两种yaml中主要的数据结构，
还支持Date，String，Double，BigInteger 和BigDecimal，
特别是它支持javabean的反序列化。

于是我在eclipse下写了一个官方提供的例子。简单的测试，一切运行正常。

下面是我项目中的例子：


{% codeblock SearchField.java lang:java %}
package org.scbit.lentinus.domain;

public class SearchField {

    private Table[] tables;

    public Table[] getTables() {
        return tables;
    }

    public void setTables(Table[] tables) {
        this.tables = tables;
    }

}
{% endcodeblock %}

{% codeblock Table.java lang:java %}
package org.scbit.lentinus.domain;

import java.io.UnsupportedEncodingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Table {
    private static Log log = LogFactory.getLog(Table.class);

    private String tableDisplayName;

    private String tableClass;

    private Field[] fields;

    public Field[] getFields() {
        return fields;
    }

    public void setFields(Field[] fields) {
        this.fields = fields;
    }

    public String getTableClass() {
        return tableClass;
    }

    public void setTableClass(String tableClass) {
        this.tableClass = tableClass;
    }

    public String getTableDisplayName() {
        return tableDisplayName;
    }

    public void setTableDisplayName(String tableDisplayName) {
        try {
            this.tableDisplayName = new String(tableDisplayName.getBytes(),
                    "utf-8");
        } catch (UnsupportedEncodingException e) {
            log.error("Table.setTableDisplayName UnsupportedEncodingException");
            e.printStackTrace();
        }
    }
}
{% endcodeblock %}

{% codeblock Field.java lang:java %}
package org.scbit.lentinus.domain;

import java.io.UnsupportedEncodingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class Field {
    private static Log log = LogFactory.getLog(Field.class);
    
    public Field() {
    }

    private String fieldDisplay;

    private String fieldName;

    public String getFieldDisplay() {
        return fieldDisplay;
    }

    public void setFieldDisplay(String fieldDisplay) {
        try {
            this.fieldDisplay = new String(fieldDisplay.getBytes(), "utf-8");
        } catch (UnsupportedEncodingException e) {
            log.error("Field.setFieldDisplay UnsupportedEncodingException");
            e.printStackTrace();
        }
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

}
{% endcodeblock %}

{% codeblock searchField.yml lang:yml %}
—
tables: 
- tableDisplayName: 基本信息
tableClass: TbBasicInfor
fields: 
- fieldDisplay: 拉丁学名
fieldName: latinName
            - fieldDisplay: 拉丁别名
fieldName: latinAlias
            - fieldDisplay: 中文名
                fieldName:chineseName
            - fieldDisplay:中文别名
                fieldName:chineseAlias
            - fieldDispaly:品种代号
                fieldName:speciesCode
            - fieldDispaly:来源单位
                fieldName:sourceCompany
    - tableDisplayName:育种者
        tableClass:TbCultivator
        fields:    
            - fieldDisplay:育种者姓名
                fieldName:cultivator
            - fieldDisplay:单位
                fieldName:cultivationCompany
            - fieldDisplay:地址
                fieldName:cultivationAddress
            - fieldDisplay:电话
                fieldName:telephone
            - fieldDisplay:邮编
                fieldName:zipCode
            - fieldDisplay:鉴定单位
                fieldName:appraisalOrganization
            - fieldDisplay:获奖
                fieldName:award
            - fieldDisplay:应用
                fieldName:application                                    
    -     tableDisplayName:菌落
        tableClass:TbColony
        fields:
            - fieldDisplay:菌丝被膜的形成
                fieldName:myceliumCapsule
            - fieldDisplay:菌丝密度
                fieldName:myceliumDensity
            - fieldDisplay:菌落表面颜色
                fieldName:surfaceColor
            - fieldDisplay:拮抗现象
                fieldName:antagonisticPhenomenon            
{% endcodeblock %}
下面是测试代码：

{% codeblock lang:java %}
@Test
    public void testField() throws Exception {

        File yamlfile = new File(
                "D:\\dev\\workplace\\eclipse_workspace\\LentinusEdodes\\src\\test\\org\\scbit\\lentinus\\domain\\searchField.yml");
        SearchField obj = Yaml.loadType(yamlfile, SearchField.class);
        System.out.println(obj.getTables()[0].getFields()[0].getFieldName());
        String str = obj.getTables()[0].getFields()[1].getFieldDisplay();
        System.out.println(new String(str.getBytes(), "gbk"));

    }
{% endcodeblock %}
测试结果：

{% codeblock lang:java %}
latinName
java.lang.ArrayIndexOutOfBoundsException: 1
    at org.scbit.lentinus.domain.TestSearchField.testField(TestSearchField.java:48)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    at sun.reflect.NativeMethodAccessorImpl.invoke(Unknown Source)
    at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source)
    at java.lang.reflect.Method.invoke(Unknown Source)
    at org.junit.internal.runners.TestMethodRunner.executeMethodBody(TestMethodRunner.java:99)
    at org.junit.internal.runners.TestMethodRunner.runUnprotected(TestMethodRunner.java:81)
    at org.junit.internal.runners.BeforeAndAfterRunner.runProtected(BeforeAndAfterRunner.java:34)
    at org.junit.internal.runners.TestMethodRunner.runMethod(TestMethodRunner.java:75)
    at org.junit.internal.runners.TestMethodRunner.run(TestMethodRunner.java:45)
    at org.junit.internal.runners.TestClassMethodsRunner.invokeTestMethod(TestClassMethodsRunner.java:71)
    at org.junit.internal.runners.TestClassMethodsRunner.run(TestClassMethodsRunner.java:35)
    at org.junit.internal.runners.TestClassRunner$1.runUnprotected(TestClassRunner.java:42)
    at org.junit.internal.runners.BeforeAndAfterRunner.runProtected(BeforeAndAfterRunner.java:34)
    at org.junit.internal.runners.TestClassRunner.run(TestClassRunner.java:52)
    at org.eclipse.jdt.internal.junit4.runner.JUnit4TestReference.run(JUnit4TestReference.java:38)
    at org.eclipse.jdt.internal.junit.runner.TestExecution.run(TestExecution.java:38)
    at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.runTests(RemoteTestRunner.java:460)
    at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.runTests(RemoteTestRunner.java:673)
    at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.run(RemoteTestRunner.java:386)
    at org.eclipse.jdt.internal.junit.runner.RemoteTestRunner.main(RemoteTestRunner.java:196)
{% endcodeblock %}
JYaml在解析多层嵌套的数据结构的时候有问题，
具体来说，在层次结构较深时Array只能解析出第一元素，即[0]。
但这个在解析时并不会抛出错误。
这个问题至今没有解决。
我使用的JYaml版本是jyaml-lib-14-1.0-beta-3.jar
不知道是我的配置文件写得有问题，还是beta般的bug。

另外在中文支持方面也有所欠缺，直接读取utf-8格式的中文会出现乱码，需要自己转码：
		this.fieldDisplay = new String(fieldDisplay.getBytes(), "utf-8");
当然你也可以帮你的yml文件的格式改为iso-8859-1不过在这种编码状态下你的中文是乱码。
希望今后的版本能有所改进。