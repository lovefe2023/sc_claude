import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all available coupons
router.get('/', async (req, res) => {
  try {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: '获取优惠券失败' });
    }

    res.json(coupons || []);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: '获取优惠券失败' });
  }
});

// Get user's coupons
router.get('/user', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    const { data: userCoupons, error } = await supabase
      .from('user_coupons')
      .select(`
        *,
        coupon:coupons(*)
      `)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: '获取用户优惠券失败' });
    }

    res.json(userCoupons || []);
  } catch (error) {
    console.error('Get user coupons error:', error);
    res.status(500).json({ error: '获取用户优惠券失败' });
  }
});

// Receive coupon
router.post('/receive', async (req, res) => {
  try {
    const { userId, couponId } = req.body;

    if (!userId || !couponId) {
      return res.status(400).json({ error: '参数不完整' });
    }

    // Check if already received
    const { data: existing } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('coupon_id', couponId)
      .single();

    if (existing) {
      return res.status(400).json({ error: '您已领取过该优惠券' });
    }

    // Check coupon availability
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single();

    if (!coupon) {
      return res.status(404).json({ error: '优惠券不存在' });
    }

    if (!coupon.is_active) {
      return res.status(400).json({ error: '优惠券已失效' });
    }

    if (coupon.total_count && coupon.received_count >= coupon.total_count) {
      return res.status(400).json({ error: '优惠券已领完' });
    }

    // Check expiration
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return res.status(400).json({ error: '优惠券已过期' });
    }

    // Add to user coupons
    const { data: userCoupon, error } = await supabase
      .from('user_coupons')
      .insert({
        user_id: userId,
        coupon_id: couponId,
        status: 'unused'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '领取优惠券失败' });
    }

    // Update coupon received count
    await supabase
      .from('coupons')
      .update({ received_count: coupon.received_count + 1 })
      .eq('id', couponId);

    // Get complete coupon info
    const { data: completeUserCoupon } = await supabase
      .from('user_coupons')
      .select(`
        *,
        coupon:coupons(*)
      `)
      .eq('id', userCoupon.id)
      .single();

    res.json(completeUserCoupon);
  } catch (error) {
    console.error('Receive coupon error:', error);
    res.status(500).json({ error: '领取优惠券失败' });
  }
});

// Use coupon
router.post('/use', async (req, res) => {
  try {
    const { userId, userCouponId, orderId } = req.body;

    if (!userId || !userCouponId) {
      return res.status(400).json({ error: '参数不完整' });
    }

    // Get user coupon
    const { data: userCoupon } = await supabase
      .from('user_coupons')
      .select(`
        *,
        coupon:coupons(*)
      `)
      .eq('id', userCouponId)
      .single();

    if (!userCoupon) {
      return res.status(404).json({ error: '用户优惠券不存在' });
    }

    if (userCoupon.status !== 'unused') {
      return res.status(400).json({ error: '优惠券已使用' });
    }

    // Check expiration
    if (userCoupon.coupon.valid_until && new Date(userCoupon.coupon.valid_until) < new Date()) {
      return res.status(400).json({ error: '优惠券已过期' });
    }

    // Mark as used
    const { error } = await supabase
      .from('user_coupons')
      .update({
        status: 'used',
        used_at: new Date().toISOString(),
        order_id: orderId
      })
      .eq('id', userCouponId);

    if (error) {
      return res.status(500).json({ error: '使用优惠券失败' });
    }

    // Update coupon used count
    await supabase
      .from('coupons')
      .update({ used_count: userCoupon.coupon.used_count + 1 })
      .eq('id', userCoupon.coupon.id);

    res.json({ success: true });
  } catch (error) {
    console.error('Use coupon error:', error);
    res.status(500).json({ error: '使用优惠券失败' });
  }
});

// Calculate discount
router.post('/calculate', async (req, res) => {
  try {
    const { userCouponId, orderAmount } = req.body;

    if (!userCouponId || !orderAmount) {
      return res.status(400).json({ error: '参数不完整' });
    }

    // Get user coupon
    const { data: userCoupon } = await supabase
      .from('user_coupons')
      .select(`
        *,
        coupon:coupons(*)
      `)
      .eq('id', userCouponId)
      .single();

    if (!userCoupon) {
      return res.status(404).json({ error: '优惠券不存在' });
    }

    const coupon = userCoupon.coupon;

    // Check if usable
    if (userCoupon.status !== 'unused') {
      return res.status(400).json({ error: '优惠券不可用' });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return res.status(400).json({ error: '优惠券已过期' });
    }

    if (orderAmount < coupon.min_order_amount) {
      return res.status(400).json({ error: `订单金额需满${coupon.min_order_amount}元` });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'fixed') {
      discount = coupon.discount_value;
    } else if (coupon.discount_type === 'percentage') {
      discount = orderAmount * (coupon.discount_value / 100);
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    }

    res.json({
      discount: Math.min(discount, orderAmount),
      coupon: coupon
    });
  } catch (error) {
    console.error('Calculate discount error:', error);
    res.status(500).json({ error: '计算优惠失败' });
  }
});

export default router;
