-- =====================================================
-- Gift Mall Database - Complete Schema + Demo Data
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (in reverse order due to FK constraints)
-- =====================================================
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS user_coupons CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar_url TEXT,
    member_level VARCHAR(20) DEFAULT 'bronze',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    review_count INTEGER DEFAULT 0,
    tags TEXT[],
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Product Images Table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Cart Items Table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 6. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    total_amount DECIMAL(10, 2) NOT NULL,
    product_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    coupon_id UUID,
    shipping_address JSONB,
    remark TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    specifications JSONB,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Addresses Table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    detail_address VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Coupons Table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    total_count INTEGER,
    received_count INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. User Coupons Table
CREATE TABLE user_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'unused',
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    order_id UUID REFERENCES orders(id),
    UNIQUE(user_id, coupon_id)
);

-- 11. Favorites Table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 12. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    images TEXT[],
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- =====================================================
-- INSERT DEMO DATA - USERS
-- =====================================================
INSERT INTO users (id, phone, password_hash, nickname, avatar_url, member_level, points, created_at) VALUES
    ('00000000-0000-0000-0000-000000000001', '13800138000', '$2a$10$DemoPassword123', '张伟', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', 'gold', 850, '2024-01-15 10:00:00+08'),
    ('00000000-0000-0000-0000-000000000002', '13900139000', '$2a$10$DemoPassword123', '李娜', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', 'silver', 420, '2024-02-20 14:30:00+08'),
    ('00000000-0000-0000-0000-000000000003', '13700137000', '$2a$10$DemoPassword123', '王强', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'bronze', 120, '2024-03-10 09:15:00+08');

-- =====================================================
-- INSERT DEMO DATA - CATEGORIES
-- =====================================================
INSERT INTO categories (id, name, slug, icon, sort_order, is_active) VALUES
    ('10000000-0000-0000-0000-000000000001', '鲜花', 'flowers', 'Flower2', 1, true),
    ('10000000-0000-0000-0000-000000000002', '玩具', 'toys', 'Gamepad2', 2, true),
    ('10000000-0000-0000-0000-000000000003', '珠宝', 'jewelry', 'Diamond', 3, true),
    ('10000000-0000-0000-0000-000000000004', '蛋糕', 'cake', 'Cake', 4, true),
    ('10000000-0000-0000-0000-000000000005', '服饰', 'clothing', 'Shirt', 5, true),
    ('10000000-0000-0000-0000-000000000006', '数码', 'electronics', 'Laptop', 6, true),
    ('10000000-0000-0000-0000-000000000007', '家居', 'home', 'Home', 7, true),
    ('10000000-0000-0000-0000-000000000008', '美妆', 'beauty', 'Sparkles', 8, true);

-- =====================================================
-- INSERT DEMO DATA - PRODUCTS
-- =====================================================
INSERT INTO products (id, name, description, category_id, price, original_price, stock, sales_count, rating, review_count, tags, specifications, is_active, is_featured, created_at) VALUES
    -- 鲜花 category
    ('20000000-0000-0000-0000-000000000001', '玫瑰花束', '新鲜红玫瑰，11朵装，象征爱情永恒', '10000000-0000-0000-0000-000000000001', 199.00, 259.00, 500, 8900, 4.9, 1234, ARRAY['热卖', '鲜花'], '{"颜色": "红色", "数量": "11朵", "包装": "精美礼盒"}', true, true, '2024-01-01 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000002', '郁金香花束', '进口郁金香，多色可选，优雅浪漫', '10000000-0000-0000-0000-000000000001', 168.00, 218.00, 300, 5600, 4.7, 890, ARRAY['新品'], '{"颜色": "混色", "数量": "10朵", "包装": "简约包装"}', true, false, '2024-02-15 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000003', '百合花束', '纯洁优雅，香气宜人', '10000000-0000-0000-0000-000000000001', 128.00, 168.00, 200, 3200, 4.8, 456, NULL, '{"颜色": "白色", "数量": "9朵"}', true, false, '2024-03-01 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000004', '向日葵花束', '阳光灿烂，活力满满', '10000000-0000-0000-0000-000000000001', 158.00, NULL, 180, 2100, 4.6, 234, NULL, '{"颜色": "黄色", "数量": "8朵"}', true, false, '2024-03-10 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000005', '兰花盆景', '高端大气，净化空气', '10000000-0000-0000-0000-000000000001', 288.00, 358.00, 80, 980, 4.9, 156, ARRAY['精品'], '{"品种": "蝴蝶兰", "规格": "中型"}', true, false, '2024-03-15 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000006', '干花装饰', '永生花，长期保存', '10000000-0000-0000-0000-000000000001', 88.00, 128.00, 150, 1500, 4.5, 120, NULL, '{"类型": "混合干花", "规格": "瓶装"}', true, false, '2024-03-20 00:00:00+08'),

    -- 蛋糕 category
    ('20000000-0000-0000-0000-000000000011', '比利时巧克力礼盒', '24粒装，黑巧与牛奶巧克力混合', '10000000-0000-0000-0000-000000000004', 89.00, 129.00, 200, 3400, 4.8, 456, ARRAY['热卖'], '{"口味": "混合", "数量": "24粒", "包装": "礼盒装"}', true, true, '2024-01-10 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000012', '法式马卡龙', '12枚入，混合口味，精美礼盒装', '10000000-0000-0000-0000-000000000004', 32.00, 49.00, 150, 2100, 4.6, 234, NULL, '{"口味": "混合", "数量": "12枚"}', true, false, '2024-02-01 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000013', '生日蛋糕', '新鲜奶油果夹心', '10000000-0000-0000-0000-000000000004', 168.00, 228.00, 50, 1200, 4.9, 320, ARRAY['热卖'], '{"规格": "8寸", "口味": "奶油水果"}', true, false, '2024-02-14 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000014', '芝士蛋糕', '浓郁芝士，入口即化', '10000000-0000-0000-0000-000000000004', 98.00, 138.00, 80, 890, 4.7, 178, NULL, '{"规格": "6寸", "口味": "原味芝士"}', true, false, '2024-03-01 00:00:00+08'),

    -- 珠宝 category
    ('20000000-0000-0000-0000-000000000021', '钻石项链', '璀璨夺目，永恒象征', '10000000-0000-0000-0000-000000000003', 2999.00, 3999.00, 20, 450, 5.0, 89, ARRAY['奢侈品'], '{"材质": "18K金", "钻石": "30分"}', true, true, '2024-01-05 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000022', '银手镯', '简约时尚，百搭款', '10000000-0000-0000-0000-000000000003', 268.00, 358.00, 100, 1200, 4.6, 234, NULL, '{"材质": "纯银", "规格": "开口"}', true, false, '2024-02-10 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000023', '珍珠耳钉', '圆润光泽，优雅气质', '10000000-0000-0000-0000-000000000003', 188.00, 258.00, 80, 780, 4.8, 156, NULL, '{"材质": "淡水珍珠", "规格": "8mm"}', true, false, '2024-02-20 00:00:00+08'),

    -- 数码 category
    ('20000000-0000-0000-0000-000000000031', '智能手表 Series 7', '智能手表，实时健康监测，时尚外观', '10000000-0000-0000-0000-000000000006', 1799.00, NULL, 50, 1500, 4.9, 256, ARRAY['新品'], '{"颜色": "黑色", "尺寸": "44mm"}', true, true, '2024-01-20 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000032', '无线降噪蓝牙耳机', '主动降噪，高品质音质', '10000000-0000-0000-0000-000000000006', 1299.00, NULL, 60, 4200, 4.9, 567, ARRAY['新品'], '{"颜色": "白色", "降噪": "主动降噪"}', true, true, '2024-02-05 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000033', '无线降噪耳机', '头戴式，哑光黑，顶级音质', '10000000-0000-0000-0000-000000000006', 249.00, 399.00, 90, 1800, 4.9, 234, ARRAY['热卖'], '{"颜色": "哑光黑", "类型": "头戴式"}', true, false, '2024-02-28 00:00:00+08'),

    -- 服饰 category
    ('20000000-0000-0000-0000-000000000041', '真皮斜挎包', '优质真皮手工制作，时尚百搭', '10000000-0000-0000-0000-000000000005', 999.00, NULL, 80, 800, 4.7, 156, ARRAY['热卖'], '{"材质": "真皮", "颜色": "棕色"}', true, false, '2024-01-08 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000042', '专业跑步运动鞋', '轻量化设计，缓震舒适，适合专业跑步', '10000000-0000-0000-0000-000000000005', 899.00, 1280.00, 120, 5600, 4.8, 342, ARRAY['热卖'], '{"尺码": "42", "颜色": "黑色"}', true, true, '2024-01-12 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000043', '意大利真丝围巾', '100%真丝，午夜蓝，优雅大方', '10000000-0000-0000-0000-000000000005', 328.00, 458.00, 80, 1200, 4.8, 178, ARRAY['热卖'], '{"材质": "100%真丝", "颜色": "午夜蓝"}', true, false, '2024-02-14 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000044', '羊绒毛衣', '100%山羊绒，柔软保暖', '10000000-0000-0000-0000-000000000005', 599.00, 799.00, 60, 650, 4.9, 98, ARRAY['新品'], '{"材质": "100%山羊绒", "颜色": "灰色", "尺码": "M"}', true, false, '2024-03-01 00:00:00+08'),

    -- 家居 category
    ('20000000-0000-0000-0000-000000000051', '现代简约陶瓷花瓶', '北欧简约风格，适合各种家居装饰', '10000000-0000-0000-0000-000000000007', 228.00, NULL, 200, 3100, 4.6, 89, ARRAY['新品'], '{"材质": "陶瓷", "风格": "北欧简约"}', true, false, '2024-01-15 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000052', '香薰蜡烛礼盒', '天然植物精油，芳香怡人', '10000000-0000-0000-0000-000000000007', 128.00, 168.00, 150, 2200, 4.7, 345, NULL, '{"香味": "薰衣草", "数量": "3个"}', true, false, '2024-02-01 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000053', '北欧风抱枕', '柔软舒适，客厅必备', '10000000-0000-0000-0000-000000000007', 68.00, 98.00, 300, 4500, 4.5, 567, NULL, '{"材质": "棉麻", "尺寸": "45*45cm"}', true, false, '2024-02-10 00:00:00+08'),

    -- 美妆 category
    ('20000000-0000-0000-0000-000000000061', '花漾精华限量版香水', '精致优雅的花漾香水，限量版包装，适合送给特别的人', '10000000-0000-0000-0000-000000000008', 638.00, 850.00, 100, 2300, 4.8, 128, ARRAY['热卖', '限量'], '{"容量": "50ml", "香调": "花香调"}', true, true, '2024-01-25 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000062', '护肤套装', '补水保湿，深层滋养', '10000000-0000-0000-0000-000000000008', 458.00, 598.00, 80, 1800, 4.9, 234, ARRAY['热卖'], '{"功效": "补水保湿", "适用": "所有肤质"}', true, false, '2024-02-05 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000063', '口红礼盒', '滋润不干，持久显色', '10000000-0000-0000-0000-000000000008', 288.00, 388.00, 120, 3200, 4.7, 456, ARRAY['新品'], '{"色号": "混色", "数量": "5支"}', true, false, '2024-02-14 00:00:00+08'),

    -- 玩具 category
    ('20000000-0000-0000-0000-000000000071', '毛绒玩具熊', '柔软舒适，送礼佳品', '10000000-0000-0000-0000-000000000002', 88.00, 128.00, 200, 5600, 4.8, 890, ARRAY['热卖'], '{"尺寸": "50cm", "材质": "毛绒"}', true, true, '2024-01-10 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000072', '积木玩具', '益智开发，动手能力', '10000000-0000-0000-0000-000000000002', 158.00, 198.00, 100, 2300, 4.7, 345, NULL, '{"材质": "塑料", "颗粒数": "500"}', true, false, '2024-02-01 00:00:00+08'),
    ('20000000-0000-0000-0000-000000000073', '遥控汽车', '炫酷造型，孩子喜爱', '10000000-0000-0000-0000-000000000002', 268.00, 358.00, 50, 1200, 4.6, 178, ARRAY['新品'], '{"比例": "1:18", "功能": "遥控"}', true, false, '2024-02-20 00:00:00+08');

-- =====================================================
-- INSERT DEMO DATA - PRODUCT IMAGES
-- =====================================================
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
    ('20000000-0000-0000-0000-000000000061', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000061', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800', 1),
    ('20000000-0000-0000-0000-000000000061', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', 2),
    ('20000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000051', 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800', 0),
    ('20000000-0000-0000-0000-000000000043', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800', 0);

-- =====================================================
-- INSERT DEMO DATA - ADDRESSES
-- =====================================================
INSERT INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail_address, is_default, created_at) VALUES
    ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '张三', '13800138000', '上海市', '上海市', '浦东新区', '陆家嘴环路1000号, 4B室', true, '2024-01-20 10:00:00+08'),
    ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '张三', '13800138000', '北京市', '北京市', '朝阳区', '建国路88号SOHO现代城A座1001室', false, '2024-02-15 14:30:00+08'),
    ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '李娜', '13900139000', '广东省', '深圳市', '南山区', '科技园南路88号', true, '2024-02-20 09:00:00+08');

-- =====================================================
-- INSERT DEMO DATA - COUPONS
-- =====================================================
INSERT INTO coupons (id, code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_from, valid_until, total_count, received_count, used_count, is_active) VALUES
    ('40000000-0000-0000-0000-000000000001', 'NEW50', '新人专享券', '新用户首单立减50元', 'fixed', 50.00, 100.00, 50.00, '2024-01-01 00:00:00+08', '2026-12-31 23:59:59+08', 1000, 156, 45, true),
    ('40000000-0000-0000-0000-000000000002', 'VIP20', 'VIP会员券', '会员专享8折优惠', 'percentage', 20.00, 200.00, 100.00, '2024-01-01 00:00:00+08', '2026-12-31 23:59:59+08', 500, 89, 23, true),
    ('40000000-0000-0000-0000-000000000003', 'FREE30', '满减券', '满200减30', 'fixed', 30.00, 200.00, 30.00, '2024-01-01 00:00:00+08', '2026-12-31 23:59:59+08', 2000, 456, 178, true),
    ('40000000-0000-0000-0000-000000000004', 'SPRING100', '春季大促', '满500减100', 'fixed', 100.00, 500.00, 100.00, '2024-03-01 00:00:00+08', '2024-04-30 23:59:59+08', 500, 234, 56, true),
    ('40000000-0000-0000-0000-000000000005', 'FREESHIP', '包邮券', '全场合包邮', 'fixed', 10.00, 0.00, 10.00, '2024-01-01 00:00:00+08', '2026-12-31 23:59:59+08', 5000, 1234, 567, true);

-- =====================================================
-- INSERT DEMO DATA - USER COUPONS
-- =====================================================
INSERT INTO user_coupons (id, user_id, coupon_id, status, received_at, used_at, order_id) VALUES
    ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'unused', '2024-03-01 10:00:00+08', NULL, NULL),
    ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 'unused', '2024-03-10 15:30:00+08', NULL, NULL),
    ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000005', 'used', '2024-02-15 09:00:00+08', '2024-02-15 09:30:00+08', NULL),
    ('50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'unused', '2024-03-05 11:00:00+08', NULL, NULL),
    ('50000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'unused', '2024-03-12 14:00:00+08', NULL, NULL);

-- =====================================================
-- INSERT DEMO DATA - ORDERS
-- =====================================================
INSERT INTO orders (id, order_number, user_id, status, payment_method, payment_status, total_amount, product_amount, shipping_fee, tax_amount, discount_amount, shipping_address, remark, paid_at, shipped_at, delivered_at, completed_at, created_at, updated_at) VALUES
    ('60000000-0000-0000-0000-000000000001', 'ORD202410240001', '00000000-0000-0000-0000-000000000001', 'pending', 'wechat', 'unpaid', 45.00, 45.00, 10.00, 2.50, 12.50, '{"receiver_name": "张三", "phone": "13800138000", "province": "上海市", "city": "上海市", "district": "浦东新区", "detail_address": "陆家嘴环路1000号, 4B室"}', NULL, NULL, NULL, NULL, '2024-10-24 14:30:00+08', '2024-10-24 14:30:00+08'),
    ('60000000-0000-0000-0000-000000000002', 'ORD202410230002', '00000000-0000-0000-0000-000000000001', 'paid', 'wechat', 'paid', 128.00, 128.00, 0.00, 0.00, 0.00, '{"receiver_name": "张三", "phone": "13800138000", "province": "北京市", "city": "北京市", "district": "朝阳区", "detail_address": "建国路88号SOHO现代城A座1001室"}', NULL, '2024-10-23 15:00:00+08', NULL, NULL, '2024-10-23 14:00:00+08', '2024-10-23 15:00:00+08', '2024-10-23 15:00:00+08'),
    ('60000000-0000-0000-0000-000000000003', 'ORD202410200003', '00000000-0000-0000-0000-000000000001', 'shipped', 'alipay', 'paid', 210.00, 210.00, 0.00, 0.00, 0.00, '{"receiver_name": "张三", "phone": "13800138000", "province": "上海市", "city": "上海市", "district": "浦东新区", "detail_address": "陆家嘴环路1000号, 4B室"}', NULL, '2024-10-20 16:00:00+08', '2024-10-22 10:00:00+08', NULL, '2024-10-20 14:30:00+08', '2024-10-22 10:00:00+08', '2024-10-22 10:00:00+08'),
    ('60000000-0000-0000-0000-000000000004', 'ORD202410150004', '00000000-0000-0000-0000-000000000001', 'completed', 'wechat', 'paid', 249.00, 249.00, 0.00, 0.00, 0.00, '{"receiver_name": "张三", "phone": "13800138000", "province": "上海市", "city": "上海市", "district": "浦东新区", "detail_address": "陆家嘴环路1000号, 4B室"}', NULL, '2024-10-15 18:00:00+08', '2024-10-18 09:00:00+08', '2024-10-22 15:00:00+08', '2024-10-15 14:00:00+08', '2024-10-22 15:00:00+08', '2024-10-22 15:00:00+08');

-- =====================================================
-- INSERT DEMO DATA - ORDER ITEMS
-- =====================================================
INSERT INTO order_items (id, order_id, product_id, product_name, product_image, price, quantity, specifications, subtotal) VALUES
    ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '郁金香花束', 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=200', 45.00, 1, '{"颜色": "混色", "数量": "10朵"}', 45.00),
    ('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000043', '意大利真丝围巾', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=200', 328.00, 1, '{"材质": "100%真丝", "颜色": "午夜蓝"}', 128.00),
    ('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000011', '比利时巧克力礼盒', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=200', 89.00, 2, '{"口味": "混合", "数量": "24粒"}', 178.00),
    ('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000012', '法式马卡龙', 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=200', 32.00, 1, '{"口味": "混合", "数量": "12枚"}', 32.00),
    ('70000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000033', '无线降噪耳机', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200', 249.00, 1, '{"颜色": "哑光黑", "类型": "头戴式"}', 249.00);

-- =====================================================
-- INSERT DEMO DATA - CART ITEMS
-- =====================================================
INSERT INTO cart_items (id, user_id, product_id, quantity, specifications) VALUES
    ('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000042', 1, '{"尺码": "42", "颜色": "黑色"}'),
    ('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 2, '{"颜色": "混色"}'),
    ('80000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000032', 1, '{"颜色": "白色"}');

-- =====================================================
-- INSERT DEMO DATA - REVIEWS
-- =====================================================
INSERT INTO reviews (id, user_id, product_id, order_id, rating, content, images, is_anonymous, status, created_at) VALUES
    ('90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000061', '60000000-0000-0000-0000-000000000004', 5, '绝对喜欢！包装精致，内容物质量上乘。会再次购买！', ARRAY['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400'], false, 'approved', '2024-10-16 10:00:00+08'),
    ('90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000031', NULL, 5, '手表非常好用，监测数据准确，续航也很给力！', NULL, false, 'approved', '2024-10-17 14:30:00+08'),
    ('90000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000042', NULL, 4, '鞋子很舒服，尺码标准，跑步很合适。', NULL, false, 'approved', '2024-10-18 09:15:00+08'),
    ('90000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', NULL, 5, '鲜花非常新鲜，女朋友很喜欢！', ARRAY['https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=400'], false, 'approved', '2024-10-19 16:20:00+08');

-- =====================================================
-- INSERT DEMO DATA - FAVORITES
-- =====================================================
INSERT INTO favorites (id, user_id, product_id, created_at) VALUES
    ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000061', '2024-03-01 10:00:00+08'),
    ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000031', '2024-03-05 15:30:00+08'),
    ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000043', '2024-03-10 09:00:00+08'),
    ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '2024-03-08 14:00:00+08');

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Users: public can read, users can update own
CREATE POLICY "Users can read all" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Products: public read active products
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);

-- Cart: users can manage their own cart
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders: users can manage their own orders
CREATE POLICY "Users can manage own orders" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own order items" ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE order_items.order_id = orders.id AND orders.user_id = auth.uid())
);

-- Addresses: users can manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);

-- Favorites: users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Reviews: users can manage their own reviews
CREATE POLICY "Users can manage own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- Coupons: public read
CREATE POLICY "Coupons are viewable by everyone" ON coupons FOR SELECT USING (true);

-- User Coupons: users can manage their own
CREATE POLICY "Users can manage own user_coupons" ON user_coupons FOR ALL USING (auth.uid() = user_id);

-- Product Images: public read
CREATE POLICY "Product images are viewable by everyone" ON product_images FOR SELECT USING (true);

-- =====================================================
-- CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    order_num := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUMMARY
-- =====================================================
SELECT 'Database setup completed successfully!' AS message;
