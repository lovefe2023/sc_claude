import { Router } from 'express';
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORD${yyyy}${mm}${dd}${random}`;
}

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const { userId, status, limit = 20, offset = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('user_id', userId);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data: orders, error } = await query;

    if (error) {
      console.error('Get orders error:', error);
      return res.status(500).json({ error: '获取订单失败' });
    }

    res.json(orders || []);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: '获取订单失败' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: '获取订单详情失败' });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      items,
      address,
      paymentMethod,
      couponId,
      remark
    } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: '参数不完整' });
    }

    if (!address) {
      return res.status(400).json({ error: '请选择收货地址' });
    }

    // Calculate amounts
    let productAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (!product) {
        return res.status(404).json({ error: `商品 ${item.productId} 不存在` });
      }

      const subtotal = product.price * item.quantity;
      productAmount += subtotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.images?.[0]?.image_url || '',
        price: product.price,
        quantity: item.quantity,
        specifications: item.specifications,
        subtotal
      });
    }

    // Apply coupon discount
    let discountAmount = 0;
    if (couponId) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', couponId)
        .single();

      if (coupon && productAmount >= coupon.min_order_amount) {
        if (coupon.discount_type === 'fixed') {
          discountAmount = coupon.discount_value;
        } else if (coupon.discount_type === 'percentage') {
          discountAmount = productAmount * (coupon.discount_value / 100);
          if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
          }
        }
      }
    }

    // Calculate shipping fee (free over 99)
    const shippingFee = productAmount - discountAmount >= 99 ? 0 : 10;

    // Calculate tax
    const taxAmount = (productAmount - discountAmount) * 0.05;

    const totalAmount = productAmount - discountAmount + shippingFee + taxAmount;

    // Create order
    const orderNumber = generateOrderNumber();
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: 'unpaid',
        total_amount: totalAmount,
        product_amount: productAmount,
        shipping_fee: shippingFee,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        coupon_id: couponId,
        shipping_address: address,
        remark
      })
      .select()
      .single();

    if (error) {
      console.error('Create order error:', error);
      return res.status(500).json({ error: '创建订单失败' });
    }

    // Create order items
    const orderItemsData = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    await supabase
      .from('order_items')
      .insert(orderItemsData);

    // Update product sales count
    for (const item of items) {
      await supabase.rpc('increment_sales_count', {
        product_id: item.productId,
        count: item.quantity
      });
    }

    // Clear cart
    if (items.length > 0) {
      const productIds = items.map((item: { productId: string }) => item.productId);
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .in('product_id', productIds);
    }

    // Get complete order with items
    const { data: completeOrder } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', order.id)
      .single();

    res.json(completeOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: '创建订单失败' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData: Record<string, unknown> = { status };

    // Update timestamps based on status
    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
      updateData.payment_status = 'paid';
    } else if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString();
    } else if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: '更新订单失败' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: '更新订单失败' });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: 'refunded'
      })
      .eq('id', id)
      .eq('status', 'pending')
      .select()
      .single();

    if (error || !order) {
      return res.status(400).json({ error: '订单无法取消' });
    }

    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: '取消订单失败' });
  }
});

// Get order count by status
router.get('/stats/count', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: '用户ID不能为空' });
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('status')
      .eq('user_id', userId);

    const stats = {
      unpaid: 0,
      unshipped: 0,
      shipped: 0,
      completed: 0,
      refund: 0
    };

    orders?.forEach(order => {
      switch (order.status) {
        case 'pending':
          stats.unpaid++;
          break;
        case 'paid':
          stats.unshipped++;
          break;
        case 'shipped':
          stats.shipped++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'refunded':
        case 'cancelled':
          stats.refund++;
          break;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: '获取订单统计失败' });
  }
});

export default router;
