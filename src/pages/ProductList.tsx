import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Filter, ArrowUpDown, Heart, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, Product } from '../api/client';
import { useCart } from '../context/CartContext';

export default function ProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('created_at');

  useEffect(() => {
    loadProducts();
  }, [sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | boolean> = {
        sort: sortBy,
        order: 'desc',
        limit: 20,
      };
      const data = await api.products.getAll(params);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    try {
      await addToCart(productId, 1);
      alert('已添加到购物车');
    } catch (error) {
      alert('添加失败，请先登录');
      navigate('/login');
    }
  };

  const displayProducts = products.map((product) => ({
    id: product.id,
    title: product.name,
    category: product.category?.name || '礼品',
    price: product.price,
    originalPrice: product.original_price,
    image: product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400',
    aspect: 'aspect-square',
    sales: product.sales_count > 1000 ? `${(product.sales_count / 1000).toFixed(1)}k` : String(product.sales_count),
    tag: product.tags?.[0],
  }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center bg-slate-100 rounded-full px-4 py-2">
            <Search className="text-slate-400 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="搜索商品..."
              className="bg-transparent border-none outline-none w-full text-sm text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Sort/Filter Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <button
            onClick={() => setSortBy('created_at')}
            className={`text-sm font-${sortBy === 'created_at' ? 'bold text-pink-600' : 'medium text-slate-600'} hover:text-pink-600 transition-colors`}
          >
            综合
          </button>
          <button
            onClick={() => setSortBy('sales')}
            className={`text-sm font-${sortBy === 'sales' ? 'bold text-pink-600' : 'medium text-slate-600'} hover:text-pink-600 transition-colors`}
          >
            销量
          </button>
          <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">
            价格
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">
            筛选
            <Filter className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {loading ? (
          <div className="text-center py-8 text-slate-400">加载中...</div>
        ) : (
          <div className="columns-2 gap-3 space-y-3">
            {displayProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="break-inside-avoid rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className={`relative w-full ${item.aspect} bg-slate-100`}>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-pink-600 transition-colors"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  {item.tag && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.tag}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-pink-600 font-medium mb-1">{item.category}</p>
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-2">{item.title}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">已售 {item.sales}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      {item.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">¥{item.originalPrice.toFixed(2)}</span>
                      )}
                      <span className="text-base font-bold text-slate-900">
                        <span className="text-xs align-top">¥</span>{item.price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, item.id)}
                      className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/30 active:scale-95 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">{products.length > 0 ? '没有更多商品了' : '暂无商品'}</p>
        </div>
      </div>
    </div>
  );
}
