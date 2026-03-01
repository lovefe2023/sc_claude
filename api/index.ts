import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabaseUrl = process.env.SUPABASE_URL || 'https://fbnflvpnyuqikdnjjnic.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibmZsdnBueXVxaWtkbmpqbmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODU4OTEsImV4cCI6MjA4Nzg2MTg5MX0.NgzzUnGnccUZjlBLRzbsbSMGbw7pXpQQ3h0h6-e9A9c';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  const path = url.split('?')[0];

  try {
    // Categories
    if (path === '/api/categories') {
      const { data } = await supabase.from('categories').select('*').order('sort_order');
      return res.json(data);
    }

    // Products list
    if (path === '/api/products') {
      const params = new URLSearchParams(url.split('?')[1] || '');
      const category = params.get('category');
      const limit = parseInt(params.get('limit') || '20');
      const offset = parseInt(params.get('offset') || '0');

      let query = supabase.from('products').select(`
        *,
        category:categories(name, slug),
        images:product_images(*)
      `).eq('is_active', true);

      if (category) {
        query = query.eq('category.slug', category);
      }

      const { data } = await query.range(offset, offset + limit - 1).order('created_at', { ascending: false });
      return res.json(data);
    }

    // Product detail
    if (path.startsWith('/api/product/')) {
      const id = path.split('/api/product/')[1];
      const { data } = await supabase.from('products').select(`
        *,
        category:categories(name, slug),
        images:product_images(*)
      `).eq('id', id).single();
      return res.json(data);
    }

    // Login
    if (path === '/api/auth/login' && method === 'POST') {
      const { phone, password } = req.body || {};

      if (!phone || !password) {
        return res.status(400).json({ error: '手机号和密码不能为空' });
      }

      const { data: user } = await supabase.from('users').select('*').eq('phone', phone).single();

      if (!user) {
        return res.status(401).json({ error: '手机号或密码错误' });
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: '手机号或密码错误' });
      }

      const token = jwt.sign({ userId: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
      const { password_hash, ...userInfo } = user;
      return res.json({ token, user: userInfo });
    }

    // Get current user
    if (path === '/api/auth/me') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: '未登录' });
      }

      const token = authHeader.replace('Bearer ', '');
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const { data: user } = await supabase.from('users').select('*').eq('id', decoded.userId).single();

        if (!user) {
          return res.status(401).json({ error: '用户不存在' });
        }

        const { password_hash, ...userInfo } = user;
        return res.json(userInfo);
      } catch {
        return res.status(401).json({ error: 'token无效' });
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
