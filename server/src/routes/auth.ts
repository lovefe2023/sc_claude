import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user info (without password)
    const { password_hash, ...userInfo } = user;
    res.json({
      token,
      user: userInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { phone, password, nickname } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // Check if phone already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: '该手机号已注册' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        phone,
        password_hash,
        nickname: nickname || `用户${phone.slice(-4)}`,
        member_level: 'bronze'
      })
      .select()
      .single();

    if (error) {
      console.error('Register error:', error);
      return res.status(500).json({ error: '注册失败' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...userInfo } = user;
    res.json({
      token,
      user: userInfo
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// Quick login (phone code - simplified for demo)
router.post('/quick-login', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone) {
      return res.status(400).json({ error: '手机号不能为空' });
    }

    // In production, verify the code from SMS
    // For demo, accept any 6-digit code
    if (code && code.length === 6) {
      // Find or create user
      let { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (!user) {
        // Auto-register
        const password_hash = await bcrypt.hash(uuidv4(), 10);
        const { data: newUser } = await supabase
          .from('users')
          .insert({
            phone,
            password_hash,
            nickname: `用户${phone.slice(-4)}`,
            member_level: 'bronze'
          })
          .select()
          .single();
        user = newUser;
      }

      const token = jwt.sign(
        { userId: user.id, phone: user.phone },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash: _, ...userInfo } = user;
      return res.json({
        token,
        user: userInfo
      });
    }

    // If no code, return success to send code (mock)
    res.json({ success: true, message: '验证码已发送' });
  } catch (error) {
    console.error('Quick login error:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未登录' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const { password_hash, ...userInfo } = user;
    res.json(userInfo);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: '无效的token' });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '未登录' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { nickname, avatar_url } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ nickname, avatar_url })
      .eq('id', decoded.userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '更新失败' });
    }

    const { password_hash, ...userInfo } = user;
    res.json(userInfo);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: '更新失败' });
  }
});

export default router;
