# dontbesilent Tweet Card Studio

把推文素材、X 风格卡片和风景背景组合成适合抖音图文发布的 3:4 竖图。

在线体验：[dontbesilent-tweet-card-studio.vercel.app](https://dontbesilent-tweet-card-studio.vercel.app/)

## 功能

- 搜索、筛选和随机抽取 1,500+ 条公开推文素材。
- 在原推基础上临时编辑文案，不改动素材库。
- 切换白色 / 黑色 X 风格卡片主题。
- 使用内置风景图库、上传本地图片，或粘贴网络图片作为背景。
- 调整背景压暗、卡片大小、卡片位置、正文字号和透明度。
- 导出 `1080 x 1440` PNG 竖图，或单独导出纯推文卡片。
- 使用离线文案池生成发布短句和话题标签，不需要后端 AI key。

> 卡片里的评论、转发、点赞、浏览和收藏数字是用于版式展示的模拟数据，不代表原推真实互动数据。

## 本地运行

需要 Node.js `22.13.0` 或更高版本。

```bash
npm install
npm run dev
```

打开终端输出的本地地址。通常是 `http://localhost:3000/`。

## 常用命令

```bash
npm run dev             # 本地开发
npm run build           # 构建静态站点
npm test                # 构建并检查素材数据
npm run captions:build  # 基于 public/posts.json 重建离线文案池
```

如果你要从自己的 Markdown 推文集重新生成 `public/posts.json`，可以运行：

```bash
npm run data:build -- ../data/source-tweets.md
```

Markdown 需要包含类似下面的结构：

```md
## 2026-01-01 · 主贴

主题：内容与传播｜表达：观点
标签：自媒体、内容创作
原帖：https://x.com/example/status/1234567890

> 这里是推文正文。
```

## 项目结构

```text
app/                    页面、样式和 API route
public/posts.json       可搜索的公开推文素材
public/captions.json    离线发布文案池
public/backgrounds/     内置背景图
scripts/                数据生成脚本
tests/                  内容与资源检查
vercel.json             Vercel 静态部署配置
```

## 数据与隐私边界

- 本仓库不包含 API key、账号凭据、Webhook、Cookie 或个人运行状态。
- 当前版本的文案生成功能只读取 `public/captions.json`，不会调用 OpenAI、DeepSeek 或其他远程模型。
- `public/posts.json` 只包含公开推文文本和原帖链接。
- 上传背景图只在浏览器本地用于导出图片，不会被本项目保存。
- `.env*`、`.vercel/`、`.wrangler/`、`dist/`、`node_modules/` 等本地配置和构建产物已被忽略。

## 部署

这个项目可以直接部署到 Vercel：

- Build Command：`npm run build`
- Output Directory：`dist/client`
- Framework Preset：Other

项目不依赖数据库和环境变量，默认部署即可运行。

## License

MIT
