# hyggeZ 学习笔记

这是发布在 GitHub Pages 上的个人学习笔记网站。

- 网站地址：<https://hyggeZ.github.io>
- Golang：11 个章节，包含语言结构、数据类型、函数、接口、协程和线程安全
- 前端基础：3 节，包含 DOM、HTML 与 DOM 属性、CSS 选择器和 JavaScript 基础
- 页面功能：A/B 首页风格切换、主题切换、B 风格环境音乐、轻量动画、阅读进度、代码高亮、代码复制和移动端适配

## 页面结构

- `index.html`：A/B 风格的满屏博客首页
- `notes.html`：独立的笔记主题目录与内容入口
- `golang.html`：Golang 笔记目录
- `frontend.html`：前端基础笔记
- `chapters/`：Golang 分章节内容
- `styles.css`：全站共用样式
- `script.js`：主题切换、代码复制、语法高亮和阅读进度
- `assets/style-b-tree.png`：B 风格原创古树主视觉插画

首页的风格选择会保存在浏览器中。A 是现代网格风格，B 是以古树、旧纸与时间感为主题的文学编辑风格。B 的“树下有风”环境声音由浏览器实时合成，只有在用户主动点击后才会播放。

页面 UI 复用说明参见 `UI_TEMPLATE.md`。

## 本地预览

在仓库目录启动一个静态文件服务器，然后访问首页即可。例如：

```bash
python -m http.server 8000
```

浏览器访问 `http://localhost:8000`。
