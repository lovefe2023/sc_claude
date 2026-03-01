# Gift Mall 礼品商城 - 数据库设置文档

## 概述

本文档描述了 Gift Mall 礼品商城应用的后端数据库设置，包含完整的数据库架构和演示数据。

## 项目结构

```
shangcheng_claude2/
├── supabase/
│   ├── complete-setup.sql    # 完整的数据库设置文件
│   ├── schema.sql            # 原始数据库架构
│   └── demo-data.sql         # 原始演示数据
├── server/                   # Express.js 后端 API
└── src/                      # React 前端应用
```

## 数据库架构

### 数据表

系统包含 12 个核心数据表：

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| categories | 商品分类表 |
| products | 商品表 |
| product_images | 商品图片表 |
| cart_items | 购物车表 |
| orders | 订单表 |
| order_items | 订单项表 |
| addresses | 收货地址表 |
| coupons | 优惠券表 |
| user_coupons | 用户优惠券表 |
| favorites | 收藏表 |
| reviews | 评价表 |

### 实体关系

```
users (1) ──────< cart_items
users (1) ──────< orders
users (1) ──────< addresses
users (1) ──────< user_coupons
users (1) ──────< favorites
users (1) ──────< reviews

categories (1) ──< products

products (1) ────< product_images
products (1) ────< cart_items
products (1) ────< order_items
products (1) ────< favorites
products (1) ────< reviews

orders (1) ──────< order_items
orders (1) ──────< user_coupons
orders (1) ──────< reviews

coupons (1) ────< user_coupons
```

## 快速开始

### 1. 运行数据库设置

在 Supabase SQL 编辑器中执行 `supabase/complete-setup.sql` 文件。

该文件会自动：
- 删除所有已存在的表（按外键约束反向顺序）
- 创建所有 12 个数据表
- 创建索引以提升查询性能
- 插入演示数据
- 启用行级安全策略 (RLS)
- 创建 RLS 策略
- 创建辅助函数和触发器

### 2. 演示数据

#### 测试用户

| 手机号 | 密码 | 昵称 | 会员等级 | 积分 |
|--------|------|------|----------|------|
| 13800138000 | DemoPassword123 | 张伟 | gold | 850 |
| 13900139000 | DemoPassword123 | 李娜 | silver | 420 |
| 13700137000 | DemoPassword123 | 王强 | bronze | 120 |

#### 商品分类

- 鲜花 (flowers)
- 玩具 (toys)
- 珠宝 (jewelry)
- 蛋糕 (cake)
- 服饰 (clothing)
- 数码 (electronics)
- 家居 (home)
- 美妆 (beauty)

## 安全设置

### 行级安全策略 (RLS)

系统为所有表启用了行级安全策略：

| 表 | 策略 |
|----|------|
| users | 公开可读，用户可修改自己的数据 |
| categories | 公开可读 |
| products | 公开可读（仅活跃商品） |
| cart_items | 用户可管理自己的购物车 |
| orders | 用户可管理自己的订单 |
| order_items | 用户可查看自己的订单项 |
| addresses | 用户可管理自己的地址 |
| favorites | 用户可管理自己的收藏 |
| reviews | 用户可管理自己的评价 |
| coupons | 公开可读 |
| user_coupons | 用户可管理自己的优惠券 |
| product_images | 公开可读 |

### 注意事项

由于 RLS 策略限制，前端应用通过后端 API 访问数据时需要：
- 使用服务角色密钥进行管理操作
- 或配置匿名访问策略

## 技术栈

- **数据库**: PostgreSQL (Supabase)
- **后端**: Express.js + TypeScript
- **前端**: React + TypeScript + Tailwind CSS
- **认证**: JWT

## 常见问题

### UUID 格式错误

确保所有 UUID 只包含十六进制字符（0-9, a-f），例如：
- ✅ `00000000-0000-0000-0000-000000000001`
- ❌ `gggggggg-gggg-gggg-gggg-gggggggggggg`
- ❌ `u0000000-0000-0000-0000-000000000001`

### 重新初始化数据库

如需重新初始化数据库，只需在 Supabase SQL 编辑器中重新运行 `complete-setup.sql` 文件即可。该文件会自动清理旧数据。

## 更新日志

### 2024-10-24
- 创建完整的数据库设置文件
- 合并 schema.sql 和 demo-data.sql
- 修复 UUID 格式问题
- 添加完整的 RLS 策略
