# dontbesilent 抖音图文生成器

把历史推文与风景背景自动合成为适合抖音发布的 3:4 图文成品。

## 功能

- 从 1,500+ 条本地推文素材中搜索或随机选择内容
- 支持编辑推文正文和自动生成发布文案
- 支持白色、黑色 X 推文卡片主题
- 自动生成可切换的模拟互动数据
- 提供内置风景图库，也可上传本地图片或使用网络图片
- 支持卡片缩放、拖动、背景压暗和字号调整
- 一键导出 1080 x 1440 PNG 成品

> 卡片中的互动数字是用于版式展示的模拟数据，不代表原推真实数据。

## 本地运行

需要 Node.js 22.13.0 或更高版本。

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000/`。

## 验证

```bash
npm test
```

## 技术栈

- React 19
- vinext
- Vite
- Cloudflare Workers
- html-to-image
- Lucide React
