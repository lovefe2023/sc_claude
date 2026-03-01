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

### Vercel

- **项目**: shangcheng_claude2
- **地址**: https://shangchengclaude2.vercel.app
- **环境变量**:
  - `SUPABASE_URL`: https://fbnflvpnyuqikdnjjnic.supabase.co
  - `SUPABASE_ANON_KEY`: (见 Vercel 配置)
  - `JWT_SECRET`: (见 Vercel 配置)

### GitHub

- **仓库**: https://github.com/lovefe2023/sc_claude
- **分支**: main

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
