import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// Get all products with optional filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      sort = 'created_at',
      order = 'desc',
      limit = 20,
      offset = 0,
      featured
    } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        images:product_images(image_url, sort_order)
      `)
      .eq('is_active', true);

    if (category) {
      // First get category id
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category as string)
        .single();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Sorting
    if (sort === 'price') {
      query = query.order('price', { ascending: order === 'asc' });
    } else if (sort === 'sales') {
      query = query.order('sales_count', { ascending: order === 'asc' });
    } else if (sort === 'rating') {
      query = query.order('rating', { ascending: order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: order === 'asc' });
    }

    query = query
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data: products, error } = await query;

    if (error) {
      console.error('Get products error:', error);
      return res.status(500).json({ error: '获取商品失败' });
    }

    res.json(products || []);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: '获取商品失败' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        images:product_images(image_url, sort_order)
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: '获取商品详情失败' });
  }
});

// Get recommended products
router.get('/recommendations/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        images:product_images(image_url, sort_order)
      `)
      .eq('is_active', true)
      .order('sales_count', { ascending: false })
      .limit(Number(limit));

    if (error) {
      return res.status(500).json({ error: '获取推荐商品失败' });
    }

    res.json(products || []);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: '获取推荐商品失败' });
  }
});

// Get products by category
router.get('/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Get category
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!category) {
      return res.status(404).json({ error: '分类不存在' });
    }

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name, slug),
        images:product_images(image_url, sort_order)
      `)
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({ error: '获取商品失败' });
    }

    res.json(products || []);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ error: '获取商品失败' });
  }
});

// Toggle favorite
router.post('/:id/favorite', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // In production, get from auth token

    if (!userId) {
      return res.status(401).json({ error: '请先登录' });
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', id)
      .single();

    if (existing) {
      // Remove from favorites
      await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);

      res.json({ favorited: false });
    } else {
      // Add to favorites
      await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          product_id: id
        });

      res.json({ favorited: true });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: '操作失败' });
  }
});

// Get user favorites
router.get('/favorites/list', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(401).json({ error: '请先登录' });
    }

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        *,
        product:products(
          *,
          images:product_images(image_url, sort_order)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: '获取收藏失败' });
    }

    res.json(favorites || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: '获取收藏失败' });
  }
});

// Get product reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(nickname, avatar_url)
      `)
      .eq('product_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) {
      return res.status(500).json({ error: '获取评价失败' });
    }

    res.json(reviews || []);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: '获取评价失败' });
  }
});

export default router;
