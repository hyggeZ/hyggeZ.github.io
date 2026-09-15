# hyggeZ 学习笔记

这是发布在 GitHub Pages 上的个人学习笔记网站。

- 网站地址：<https://hyggeZ.github.io>
- Golang：11 个章节，包含语言结构、数据类型、函数、接口、协程和线程安全
- 前端基础：3 节，包含 DOM、HTML 与 DOM 属性、CSS 选择器和 JavaScript 基础
- 页面功能：主题切换、阅读进度、代码高亮、代码复制和移动端适配

## 页面结构

- `index.html`：博客主页和笔记入口
- `golang.html`：Golang 笔记目录
- `frontend.html`：前端基础笔记
- `chapters/`：Golang 分章节内容
- `styles.css`：全站共用样式
- `script.js`：主题切换、代码复制、语法高亮和阅读进度

页面 UI 复用说明参见 `UI_TEMPLATE.md`。

## 本地预览

在仓库目录启动一个静态文件服务器，然后访问首页即可。例如：

```bash
python -m http.server 8000
```

浏览器访问 `http://localhost:8000`。
