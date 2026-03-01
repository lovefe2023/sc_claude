# Gift Mall 礼品商城

## 项目概述

这是一个移动优先的全栈电子商务 Web 应用，提供商品浏览、购物车、订单管理、用户登录等功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript + Tailwind CSS 4 + Motion |
| 后端 | Express.js + TypeScript (本地开发) / Vercel Serverless (生产) |
| 数据库 | PostgreSQL (Supabase) |
| 部署 | Vercel |

## 项目结构

```
shangcheng_claude2/
├── src/                    # 前端源码
│   ├── pages/              # 页面组件 (11个)
│   ├── context/            # React Context (Auth, Cart)
│   ├── api/client.ts       # API 客户端
│   └── App.tsx             # 主应用 (路由配置)
├── server/                 # 后端 (本地开发)
│   └── src/routes/         # API 路由
├── api/index.js            # Vercel Serverless API
├── supabase/               # 数据库脚本
│   ├── schema.sql          # 数据表结构
│   └── demo-data.sql       # 测试数据
└── vercel.json             # Vercel 配置
```

## 功能模块

- ✅ 用户认证（手机号登录、注册）
- ✅ 商品浏览（分类、列表、搜索、详情）
- ✅ 购物车
- ✅ 订单管理
- ✅ 收货地址管理
- ✅ 优惠券
- ✅ 用户收藏

## 数据库

- **平台**: Supabase (PostgreSQL)
- **项目 ID**: fbnflvpnyuqikdnjjnic
- **数据表**: 12个 (users, categories, products, orders, cart_items 等)

## 部署信息

### Vercel 部署

#### 1. 部署步骤

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 链接项目
vercel link

# 添加环境变量
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add JWT_SECRET production

# 部署到生产环境
vercel --prod
```

#### 2. 环境变量

| 变量名 | 值 |
|--------|-----|
| `SUPABASE_URL` | https://fbnflvpnyuqikdnjjnic.supabase.co |
| `SUPABASE_ANON_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibmZsdnBueXVxaWtkbmpqbmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODU4OTEsImV4cCI6MjA4Nzg2MTg5MX0.NgzzUnGnccUZjlBLRzbsbSMGbw7pXpQQ3h0h6-e9A9c |
| `JWT_SECRET` | FvXrqEAyjO6xNFjHmf6A97E3TcwLT3i0NQmASdbQNEIBpCvERBgT6XDrQf2qIl/2B4EqGdlIY0j6wtbc15OESw== |

#### 3. 部署地址

- **生产环境**: https://shangchengclaude2.vercel.app

### GitHub

- **仓库**: https://github.com/lovefe2023/sc_claude
- **分支**: main
- **推送命令**: `git push -u origin main`

## 测试账号

| 手机号 | 密码 |
|--------|------|
| 13800138000 | DemoPassword123 |
| 13900139000 | DemoPassword123 |
| 13700137000 | DemoPassword123 |

## 本地开发

```bash
# 安装依赖
npm install
cd server && npm install

# 启动前端
npm run dev  # http://localhost:3000

# 启动后端
cd server && npm run dev  # http://localhost:3001
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/categories` | GET | 获取分类列表 |
| `/api/products` | GET | 获取商品列表 |
| `/api/products/recommendations/list` | GET | 获取推荐商品 |
| `/api/product/:id` | GET | 获取商品详情 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/me` | GET | 获取当前用户 |

## 版本

- 前端: 1.0.0
- 后端: 1.0.0
- 最后更新: 2026-03-01
