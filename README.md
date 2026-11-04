# Cosmic Weather Cards

一个诗意的宇宙数据集网站，将 NASA 的每日天文图片转化为可阅读、可分类、可触摸的数据和视觉艺术作品。

## 项目概述

这个项目从 NASA APOD (Astronomy Picture of the Day) API 抓取宇宙图像，提取色彩和视觉特征，并通过 p5.js 将其转译为抽象的几何形状生成艺术作品。每个宇宙图像被转化为：

- **色彩数据**：3-5 个主色调
- **视觉特征**：亮度、对比度、饱和度
- **天体分类**：星云、星系、星团、行星等
- **情绪标签**：drifting, expanding, silent...
- **微型诗歌**：基于图像内容生成的短句

## 技术栈

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **p5.js** - 生成式视觉艺术
- **Tailwind CSS** - 样式系统
- **node-vibrant** - 色彩提取

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 获取 NASA API Key（可选但推荐）

NASA API 的 DEMO_KEY 有速率限制。建议获取免费 API key：

1. 访问 https://api.nasa.gov/
2. 填写表单获取 API key
3. 创建 `.env.local` 文件：

```bash
NASA_API_KEY=your_api_key_here
```

### 3. 抓取 NASA APOD 数据

```bash
npm run fetch-apod
```

这会：
- 从 NASA API 获取最近 40 天的天文图片
- 下载图片到 `public/cosmic-images/`
- 保存原始数据到 `data/apod-raw.json`

### 4. 处理图片并生成数据集

```bash
npm run generate-dataset
```

这会：
- 从每张图片提取主色调
- 计算亮度、对比度、饱和度
- 分类天体类型
- 生成情绪标签和微型诗歌
- 生成最终数据集 `data/cosmic-records.json`

### 5. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看网站。

## 项目结构

```
cosmic-weather/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页（Archive Grid）
│   ├── day/[date]/        # 详情页
│   └── layout.tsx         # 根布局
├── components/             # React 组件
│   ├── CosmicCard.tsx     # 卡片组件
│   ├── CosmicCanvas.tsx   # p5.js 画布
│   ├── ColorPalette.tsx   # 色带展示
│   └── DataDisplay.tsx    # 数据展示
├── lib/
│   ├── p5/                # p5.js 生成系统
│   │   ├── cosmicGenerator.ts
│   │   └── templates/     # 5 种视觉模板
│   └── utils/             # 工具函数
├── scripts/                # 数据抓取脚本
│   ├── fetchAPOD.js
│   └── generateDataset.js
└── data/                   # 数据文件
    └── cosmic-records.json
```

## p5.js 视觉生成系统

项目包含 5 种视觉模板，根据天体类型自动选择：

1. **Nebula System** - 有机 blob 形状 + 粒子场
2. **Galaxy System** - 螺旋臂 + 旋转动画
3. **Cluster System** - 多个圆形分布 + 脉动
4. **Planetary System** - 规则圆 + 环系统
5. **Abstract Lines** - 抽象线条系统

每个模板根据以下数据参数调整：
- 主色调 → 颜色
- 亮度 → 背景深浅 + 透明度
- 对比度 → 形状数量和大小
- 饱和度 → 颜色纯度

## 视觉风格

- **背景色**：深蓝 (#050713)
- **文字色**：暖白 (#e8e6e3)
- **字体**：Inter (sans) + EB Garamond (serif)
- **动画**：慢、平滑、呼吸感
- **整体感觉**：安静、诗意、editorial 风格

## 开发命令

```bash
npm run dev          # 开发服务器
npm run build        # 构建生产版本
npm run start        # 运行生产版本
npm run lint         # 代码检查
npm run fetch-apod   # 抓取 NASA 数据
npm run generate-dataset  # 生成数据集
```

## 注意事项

1. **API 限制**：使用 DEMO_KEY 时，每小时限制 30 次请求。建议获取自己的 API key。
2. **图片下载**：确保有足够的磁盘空间存储 40 张图片。
3. **色彩提取**：处理大量图片可能需要一些时间。

## 许可证

MIT License

## 致谢

- NASA APOD API
- p5.js 社区
- 所有为这个项目提供灵感的人

