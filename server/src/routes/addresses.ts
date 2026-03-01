import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get user's addresses
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: '获取地址失败' });
    }

    res.json(addresses || []);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: '获取地址失败' });
  }
});

// Get single address
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: address, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !address) {
      return res.status(404).json({ error: '地址不存在' });
    }

    res.json(address);
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ error: '获取地址失败' });
  }
});

// Create address
router.post('/', async (req, res) => {
  try {
    const { userId, receiverName, phone, province, city, district, detailAddress, isDefault } = req.body;

    if (!userId || !receiverName || !phone || !detailAddress) {
      return res.status(400).json({ error: '请填写完整信息' });
    }

    // If setting as default, remove other defaults
    if (isDefault) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        receiver_name: receiverName,
        phone,
        province,
        city,
        district,
        detail_address: detailAddress,
        is_default: isDefault || false
      })
      .select()
      .single();

    if (error) {
      console.error('Create address error:', error);
      return res.status(500).json({ error: '添加地址失败' });
    }

    res.json(address);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: '添加地址失败' });
  }
});

// Update address
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { receiverName, phone, province, city, district, detailAddress, isDefault, userId } = req.body;

    // If setting as default, remove other defaults
    if (isDefault && userId) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('id', id);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update({
        receiver_name: receiverName,
        phone,
        province,
        city,
        district,
        detail_address: detailAddress,
        is_default: isDefault
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '更新地址失败' });
    }

    res.json(address);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: '更新地址失败' });
  }
});

// Delete address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: '删除地址失败' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: '删除地址失败' });
  }
});

// Set default address
router.put('/:id/default', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    // Remove all defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Set new default
    const { data: address, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '设置默认地址失败' });
    }

    res.json(address);
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: '设置默认地址失败' });
  }
});

export default router;
