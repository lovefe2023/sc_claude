-- Supabase Database Schema for Gift Mall E-commerce App
-- Run this SQL in Supabase SQL Editor to create all tables

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    avatar_url TEXT,
    member_level VARCHAR(20) DEFAULT 'bronze', -- bronze, silver, gold, platinum
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50), -- lucide icon name
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
    tags TEXT[], -- array of tags
    specifications JSONB, -- product specifications
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
    specifications JSONB, -- selected specifications
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 6. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, delivered, completed, cancelled, refunded
    payment_method VARCHAR(20), -- wechat, alipay
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid, refunded
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
    discount_type VARCHAR(20) NOT NULL, -- fixed, percentage
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
    status VARCHAR(20) DEFAULT 'unused', -- unused, used, expired
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
    images TEXT[], -- array of image URLs
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
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

-- Insert default categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
    ('鲜花', 'flowers', 'Flower2', 1),
    ('玩具', 'toys', 'Gamepad2', 2),
    ('珠宝', 'jewelry', 'Diamond', 3),
    ('蛋糕', 'cake', 'Cake', 4),
    ('服饰', 'clothing', 'Shirt', 5),
    ('数码', 'electronics', 'Laptop', 6),
    ('家居', 'home', 'Home', 7),
    ('美妆', 'beauty', 'Sparkles', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, category_id, price, original_price, stock, sales_count, rating, review_count, tags, is_featured)
SELECT
    p.name,
    p.description,
    c.id,
    p.price,
    p.original_price,
    p.stock,
    p.sales_count,
    p.rating,
    p.review_count,
    p.tags,
    p.is_featured
FROM (
    VALUES
        ('花漾精华限量版香水', '精致优雅的花漾香水，限量版包装，适合送给特别的人', (SELECT id FROM categories WHERE slug = 'beauty'), 638.00, 850.00, 100, 2300, 4.8, 128, ARRAY['热卖', '限量'], true),
        ('智能手表 Series 7', '智能手表，实时健康监测，时尚外观', (SELECT id FROM categories WHERE slug = 'electronics'), 1799.00, NULL, 50, 1500, 4.9, 256, ARRAY['新品'], true),
        ('真皮斜挎包', '优质真皮手工制作，时尚百搭', (SELECT id FROM categories WHERE slug = 'clothing'), 999.00, NULL, 80, 800, 4.7, 156, ARRAY['热卖'], false),
        ('现代简约陶瓷花瓶', '北欧简约风格，适合各种家居装饰', (SELECT id FROM categories WHERE slug = 'home'), 228.00, NULL, 200, 3100, 4.6, 89, ARRAY['新品'], false),
        ('专业跑步运动鞋', '轻量化设计，缓震舒适，适合专业跑步', (SELECT id FROM categories WHERE slug = 'clothing'), 899.00, 1280.00, 120, 5600, 4.8, 342, ARRAY['热卖'], true),
        ('无线降噪蓝牙耳机', '主动降噪，高品质音质', (SELECT id FROM categories WHERE slug = 'electronics'), 1299.00, NULL, 60, 4200, 4.9, 567, ARRAY['新品'], true),
        ('玫瑰花束', '新鲜红玫瑰，11朵装，象征爱情', (SELECT id FROM categories WHERE slug = 'flowers'), 199.00, 259.00, 500, 8900, 4.9, 1234, ARRAY['热卖'], true),
        ('郁金香花束', '进口郁金香，多色可选', (SELECT id FROM categories WHERE slug = 'flowers'), 168.00, 218.00, 300, 5600, 4.7, 890, ARRAY['新品'], false),
        ('比利时巧克力礼盒', '24粒装，黑巧与牛奶巧克力混合', (SELECT id FROM categories WHERE slug = 'cake'), 89.00, 129.00, 200, 3400, 4.8, 456, ARRAY['热卖'], false),
        ('法式马卡龙', '12枚入，混合口味，精美礼盒装', (SELECT id FROM categories WHERE slug = 'cake'), 32.00, 49.00, 150, 2100, 4.6, 234, NULL, false),
        ('意大利真丝围巾', '100%真丝，午夜蓝，优雅大方', (SELECT id FROM categories WHERE slug = 'clothing'), 328.00, 458.00, 80, 1200, 4.8, 178, ARRAY['热卖'], false),
        ('无线降噪耳机', '头戴式，哑光黑，顶级音质', (SELECT id FROM categories WHERE slug = 'electronics'), 249.00, 399.00, 90, 1800, 4.9, 234, ARRAY['热卖'], false)
) AS p(name, description, category_id, price, original_price, stock, sales_count, rating, review_count, tags, is_featured)
CROSS JOIN (SELECT id FROM categories WHERE slug = 'flowers' LIMIT 1) c
WHERE p.category_id = c.id;

-- Fix: Insert products with correct category reference
DO $$
DECLARE
    beauty_cat UUID;
    electronics_cat UUID;
    clothing_cat UUID;
    home_cat UUID;
    flowers_cat UUID;
    cake_cat UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO beauty_cat FROM categories WHERE slug = 'beauty';
    SELECT id INTO electronics_cat FROM categories WHERE slug = 'electronics';
    SELECT id INTO clothing_cat FROM categories WHERE slug = 'clothing';
    SELECT id INTO home_cat FROM categories WHERE slug = 'home';
    SELECT id INTO flowers_cat FROM categories WHERE slug = 'flowers';

    -- Insert products with correct categories
    INSERT INTO products (name, description, category_id, price, original_price, stock, sales_count, rating, review_count, tags, is_featured) VALUES
        ('花漾精华限量版香水', '精致优雅的花漾香水，限量版包装，适合送给特别的人', beauty_cat, 638.00, 850.00, 100, 2300, 4.8, 128, ARRAY['热卖', '限量'], true),
        ('智能手表 Series 7', '智能手表，实时健康监测，时尚外观', electronics_cat, 1799.00, NULL, 50, 1500, 4.9, 256, ARRAY['新品'], true),
        ('真皮斜挎包', '优质真皮手工制作，时尚百搭', clothing_cat, 999.00, NULL, 80, 800, 4.7, 156, ARRAY['热卖'], false),
        ('现代简约陶瓷花瓶', '北欧简约风格，适合各种家居装饰', home_cat, 228.00, NULL, 200, 3100, 4.6, 89, ARRAY['新品'], false),
        ('专业跑步运动鞋', '轻量化设计，缓震舒适，适合专业跑步', clothing_cat, 899.00, 1280.00, 120, 5600, 4.8, 342, ARRAY['热卖'], true),
        ('无线降噪蓝牙耳机', '主动降噪，高品质音质', electronics_cat, 1299.00, NULL, 60, 4200, 4.9, 567, ARRAY['新品'], true);

    INSERT INTO products (name, description, category_id, price, original_price, stock, sales_count, rating, review_count, tags, is_featured) VALUES
        ('玫瑰花束', '新鲜红玫瑰，11朵装，象征爱情', flowers_cat, 199.00, 259.00, 500, 8900, 4.9, 1234, ARRAY['热卖'], true),
        ('郁金香花束', '进口郁金香，多色可选', flowers_cat, 168.00, 218.00, 300, 5600, 4.7, 890, ARRAY['新品'], false);

    -- Insert cake products
    INSERT INTO products (name, description, category_id, price, original_price, stock, sales_count, rating, review_count, tags, is_featured) VALUES
        ('比利时巧克力礼盒', '24粒装，黑巧与牛奶巧克力混合', cake_cat, 89.00, 129.00, 200, 3400, 4.8, 456, ARRAY['热卖'], false),
        ('法式马卡龙', '12枚入，混合口味，精美礼盒装', cake_cat, 32.00, 49.00, 150, 2100, 4.6, 234, NULL, false);
END $$;

-- Insert product images
INSERT INTO product_images (product_id, image_url, sort_order)
SELECT p.id, img.url, img.sort_order
FROM products p
CROSS JOIN (
    VALUES
        ('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800', 0),
        ('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800', 1),
        ('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crip&q=80&w=800', 2),
        ('https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800', 3)
) AS img(url, sort_order)
WHERE p.name = '花漾精华限量版香水';

-- Insert sample coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_from, valid_until, total_count)
VALUES
    ('NEW50', '新人专享券', '新用户首单立减', 'fixed', 50.00, 100.00, 50.00, NOW(), NOW() + INTERVAL '30 days', 1000),
    ('VIP20', 'VIP会员券', '会员专享8折', 'percentage', 20.00, 200.00, 100.00, NOW(), NOW() + INTERVAL '90 days', 500),
    ('FREE30', '满减券', '满200减30', 'fixed', 30.00, 200.00, 30.00, NOW(), NOW() + INTERVAL '60 days', 2000);

-- Enable Row Level Security
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

-- Create RLS policies
-- Users: users can read their own data, public can read
CREATE POLICY "Users can read all" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- Products: public read
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

-- Create function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
BEGIN
    order_num := 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
