---
layout: post
title: "第一个WM_SIZE消息(SDK学习笔记)"
date: 2006-05-13 15:32:40 +0800
comments: true
categories: 
---
昨天在学习在sdk下创建状态栏，
在《windows程序设计》中没有相关内容，
只好求助于msdn，
我装的是6.0中文版的，不过翻译的很不完全，还不如不翻译。
在Platform SDk/User Interface Services/Common Controls/Status Bars
中我找到了相关介绍，
庆幸的是还有示例代码，如下：
{% codeblock sample_code lang:c%}
 // DoCreateStatusBar – creates a status bar and divides it into 
//     the specified number of parts. 
// Returns the handle to the status bar. 
// hwndParent – parent window for the status bar. 
// nStatusID – child window identifier. 
// hinst – handle to the application instance. 
// nParts – number of parts into which to divide the status bar. 
HWND DoCreateStatusBar(HWND hwndParent, int nStatusID, 
    HINSTANCE hinst, int nParts) 
{ 
    HWND hwndStatus; 
    RECT rcClient; 
    HLOCAL hloc; 
    LPINT lpParts; 
    int i, nWidth;
    // Ensure that the common control DLL is loaded. 
    InitCommonControls();

    // Create the status bar. 
    hwndStatus = CreateWindowEx( 
        0,                       // no extended styles 
        STATUSCLASSNAME,         // name of status bar class 
        (LPCTSTR) NULL,          // no text when first created 
        SBARS_SIZEGRIP |         // includes a sizing grip 
        WS_CHILD,                // creates a child window 
        0, 0, 0, 0,              // ignores size and position 
        hwndParent,              // handle to parent window 
        (HMENU) nStatusID,       // child window identifier 
        hinst,                   // handle to application instance 
        NULL);                   // no window creation data

    // Get the coordinates of the parent window’s client area. 
    GetClientRect(hwndParent, &rcClient);

    // Allocate an array for holding the right edge coordinates. 
    hloc = LocalAlloc(LHND, sizeof(int) * nParts); 
    lpParts = LocalLock(hloc);

    // Calculate the right edge coordinate for each part, and 
    // copy the coordinates to the array. 
    nWidth = rcClient.right / nParts; 
    for (i = 0; i < nParts; i++) { 
        lpParts[i] = nWidth; 
        nWidth += nWidth; 
    } 

    // Tell the status bar to create the window parts. 
    SendMessage(hwndStatus, SB_SETPARTS, (WPARAM) nParts, 
        (LPARAM) lpParts);

    // Free the array, and return. 
    LocalUnlock(hloc); 
    LocalFree(hloc); 
    return hwndStatus; 
}

////////////////////////////////////////////////////////
{% endcodeblock %}
注意到上面43-44行
程序的本意是想等分状态栏成nParts，
但lpParts[i]，每等分的起始位置，却在循环中呈2的倍数增长。
当nParts==4时，实际效果只有3块。
于是我改了一下，
    for (i = 0; i < nParts; i++) { 
        lpParts[i] = nWidth*(i+1);
    } 
这样显示就正常了。
 
另外：如要在状态栏中显示其他信息，可以通过SendMessage函数发送SB_SETTEXT消息，在WPARAM中指定状态栏的索引，LPARAM中指定将要显示的字符串。