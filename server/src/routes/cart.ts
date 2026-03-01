import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get user's cart
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          *,
          images:product_images(image_url, sort_order)
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Get cart error:', error);
      return res.status(500).json({ error: '获取购物车失败' });
    }

    res.json(cartItems || []);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: '获取购物车失败' });
  }
});

// Add to cart
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity = 1, specifications } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: '参数不完整' });
    }

    // Check if product exists
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    // Check if already in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { data: updatedItem, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: '更新购物车失败' });
      }

      return res.json(updatedItem);
    }

    // Add new item
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        quantity,
        specifications
      })
      .select()
      .single();

    if (error) {
      console.error('Add to cart error:', error);
      return res.status(500).json({ error: '添加到购物车失败' });
    }

    res.json(cartItem);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: '添加到购物车失败' });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: '数量必须大于0' });
    }

    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '更新购物车失败' });
    }

    res.json(cartItem);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: '更新购物车失败' });
  }
});

// Remove from cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: '删除失败' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// Clear cart
router.delete('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: '清空购物车失败' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: '清空购物车失败' });
  }
});

export default router;
