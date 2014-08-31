---
layout: post
title: "使用Castor实现对象数据绑定"
date: 2007-01-16 19:11:07 +0800
comments: true
categories: 
---
> 在项目需要从配置文件中读取一些数据，
yaml的作为一种可选的非XML方案已经宣告失败，
同事给我推荐了另外两个XML的解决方案：
[Castor](http://www.castor.org/)或者[Digester](http://jakarta.apache.org/commons/digester/)

* Castor是一种将Java对象和XML自动绑定的开源软件. 它可以在Java对象,XML文本,SQL数据表以及LDAP目录之间绑定.
* Digester原是Apache Jakarta Struts计划中的一部分，用来解析Web App中的XML配置文件，在开发一段时间之后，开发人员觉得这个小工具具有很普遍的使用场合，于是，将这个部分独立出来，放到Commons项目中。

由于Digester只是支持由XML到JavaBean的单向转换，而我的项目还需要能够从JavaBean到XML的转换。
所以我选择了Castor。

下面是Castor的例子

{% codeblock SearchField.java lang:java %}
package org.scbit.lentinus.domain;

import java.util.ArrayList;
import java.util.List;

public
class SearchField {

    private List<Table> tables;
    
    public SearchField() {
        this.tables = new ArrayList<Table>();
    }

    public List<Table> getTables() {
        return
tables;
    }

    public
void addTable(Table table) {
        this.tables.add(table);
    }
}
{% endcodeblock %}

{% codeblock Table.java lang:java %}
package org.scbit.lentinus.domain;

import java.util.ArrayList;
import java.util.List;

public
class Table {

    private String tableDisplayName;

    private String tableClass;

    private List<Field> fields;

    public Table() {
        this.fields = new ArrayList<Field>();
    }

    public List<Field> getFields() {
        return fields;
    }

    public void addField(Field field) {
        this.fields.add(field);
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
            this.tableDisplayName = tableDisplayName;
    }
}
{% endcodeblock %}

{% codeblock Field.java lang:java %}
package org.scbit.lentinus.domain;

public
class Field {

    public Field() {
    }

    private String fieldDisplay;

    private String fieldName;

    public String getFieldDisplay() {
        return fieldDisplay;
    }

    public void setFieldDisplay(String fieldDisplay) {
        this.fieldDisplay = fieldDisplay;

    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

}
{% endcodeblock %}
转换代码
{% codeblock lang:java %}
    @Test
    public void testField() throws Exception {
        SearchField searchField = new SearchField();
        Table table;
        Field field;
        table = new Table();
        table.setTableDisplayName("级别信息");
        table.setTableClass("TbBasicInfor");
        field = new Field();
        field.setFieldDisplay("拉丁学名");
        field.setFieldName("latinName");
        table.addField(field);
        field = new Field();
        field.setFieldDisplay("拉丁别名");
        field.setFieldName("latinAlias");
        table.addField(field);
        searchField.addTable(table);
        // write it out as XML
        File file = new File(
                "D:\\dev\\workplace\\eclipse_workspace\\LentinusEdodes\\WebRoot\\WEB-INF\\conf\\searchField.xml");
        Writer writer = new OutputStreamWriter(new FileOutputStream(file),
                "utf-8");
        Marshaller marshaller = new Marshaller(writer);
        marshaller.setEncoding("utf-8"); // 关键
        marshaller.marshal(searchField);
        // now restore the value and list what we get
        Reader reader = new InputStreamReader(new FileInputStream(file),
                "utf-8");
        SearchField read = (SearchField) Unmarshaller.unmarshal(
                SearchField.class, reader);

        assertTrue(read.getTables().get(0).getTableDisplayName().equals("级别信息"));
        writer.close();
        reader.close();

    }
{% endcodeblock %}

转换后的XML文件

searchField.xml
{% codeblock lang:xml %}
<?xml version="1.0" encoding="utf-8"?>
<search-field>
    <tables xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:type="java:org.scbit.lentinus.domain.Table">
        <fields xsi:type="java:org.scbit.lentinus.domain.Field">
            <field-display>拉丁学名</field-display>
            <field-name>latinName</field-name>
        </fields>
        <fields xsi:type="java:org.scbit.lentinus.domain.Field">
            <field-display>拉丁别名</field-display>
            <field-name>latinAlias</field-name>
        </fields>
        <table-class>TbBasicInfor</table-class>
        <table-display-name>级别信息</table-display-name>
    </tables>
</search-field>
{% endcodeblock %}

Castor使用起来还是比较简单的，但在读取中文的时候，要注意可能会有乱码问题，在它官方的FAQ中有相应的解释和解决方法。
> How do I set the encoding?
Create a new instance of the Marshaller class and use the setEncoding method. You’ll also need to make sure the encoding for the Writer is set properly as well: 
…
String encoding = "ISO-8859-1";
FileOutputStream fos = new FileOutputStream("result.xml");
OutputStreamWriter osw = new OuputStreamWriter(fos, encoding);
Marshaller marshaller = new Marshaller(osw);
marshaller.setEncoding(encoding);
…

### 参考文章

1. [XML 与 Java 技术: 用 Castor 进行数据绑定](http://www.ibm.com/developerworks/cn/xml/x-bindcastor/)
2. [Castor JDO 入门](http://www-128.ibm.com/developerworks/cn/java/j-castor/index.html)
3. [学习Digester笔记](http://www.blogchinese.com/06081/242496/archives/2006/200693205223.shtml)