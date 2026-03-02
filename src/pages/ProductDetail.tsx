import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Flame, ChevronRight, MapPin, Star, HeadphonesIcon, ShoppingCart, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, Product } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToCart, totalItems } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.products.getById(id!);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      showToastMessage('加载商品失败');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToastMessage('请先登录');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      showToastMessage('已加入购物车');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToastMessage('添加失败，请重试');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      showToastMessage('请先登录');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      navigate('/checkout');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToastMessage('添加失败，请重试');
    } finally {
      setAddingToCart(false);
    }
  };

  // 获取商品图片列表
  const images = product?.images?.length
    ? product.images.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url)
    : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800'];

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <p className="text-slate-500 mb-4">商品不存在</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-pink-600 text-white rounded-full"
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased pb-24 min-h-screen">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-600/10 transition-colors duration-200">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto w-full">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-pink-600/10 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </button>
          <h2 className="text-lg font-bold leading-tight flex-1 text-center opacity-100 transition-opacity duration-300">商品详情</h2>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-pink-600/10 transition-colors cursor-pointer">
            <Share2 className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto w-full flex flex-col pt-[72px]">
        {/* Main Image */}
        <div className="relative w-full aspect-square bg-white overflow-hidden group">
          <div
            className="w-full h-full bg-center bg-cover transition-transform duration-500 hover:scale-105"
            style={{ backgroundImage: `url(${images[selectedImage]})` }}
          ></div>
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {selectedImage + 1}/{images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex w-full overflow-x-auto no-scrollbar px-4 py-4 gap-3 bg-white border-b border-pink-600/10">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 aspect-square rounded-lg border-2 ${idx === selectedImage ? 'border-pink-600' : 'border-transparent opacity-70'} overflow-hidden cursor-pointer`}
              >
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}></div>
              </div>
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="bg-white px-4 py-5 mb-2">
          <h1 className="text-2xl font-bold leading-tight text-slate-900 mb-3">{product.name}</h1>
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-pink-600">¥{product.price.toFixed(2)}</span>
              {product.original_price > product.price && (
                <span className="text-base text-slate-500 line-through decoration-slate-400">¥{product.original_price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 bg-pink-600/5 px-2 py-1 rounded text-xs text-pink-600 font-medium">
              <Flame className="w-4 h-4" />
              <span>已售 {(product.sales_count / 1000).toFixed(1)}k</span>
            </div>
          </div>
          {/* Tags */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {product.tags?.includes('free_shipping') && (
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium border border-green-200">包邮</div>
            )}
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium border border-blue-200">正品保证</div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white px-4 py-4 mb-2 flex items-center justify-between cursor-pointer group hover:bg-slate-50 transition-colors">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 mb-1">选择规格</p>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 border border-black/10"></span>
              <p className="text-sm text-slate-500">颜色：红色，尺寸：中号</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Delivery Info */}
        <div className="bg-white px-4 py-4 mb-2 flex items-start gap-3">
          <MapPin className="w-6 h-6 text-slate-400 mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-bold text-slate-900">配送至</p>
              <span className="text-xs text-pink-600 font-medium cursor-pointer">修改</span>
            </div>
            <p className="text-sm text-slate-900 mb-1">北京市朝阳区三里屯 100020</p>
            <p className="text-xs text-slate-500">预计送达：11月24日 - 11月26日</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-pink-600/20 flex-1"></div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">商品详情</h3>
            <div className="h-px bg-pink-600/20 flex-1"></div>
          </div>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>{product.description || '暂无商品详情'}</p>
            {images.slice(1).map((img, idx) => (
              <div key={idx} className="w-full rounded-lg overflow-hidden my-4">
                <img src={img} alt={`商品详情 ${idx + 2}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white px-4 py-6 mt-2 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">评价 ({product.review_count || 0})</h3>
            <div className="flex items-center text-pink-600 text-sm font-medium cursor-pointer">
              查看全部 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          {product.review_count > 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-pink-600/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="text-pink-600 text-sm font-bold">用</span>
                  </div>
                  <span className="text-sm font-bold">用户评价</span>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600">商品质量很好，物流也很快，非常满意！</p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-slate-50 border border-pink-600/5 text-center text-slate-400">
              暂无评价
            </div>
          )}
        </div>
      </main>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pink-600/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-md mx-auto w-full px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-4 mr-2">
            <button className="flex flex-col items-center justify-center gap-1 min-w-[40px] text-slate-500 hover:text-pink-600 transition-colors">
              <HeadphonesIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">客服</span>
            </button>
            <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center gap-1 min-w-[40px] text-slate-500 hover:text-pink-600 transition-colors relative">
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
              <ShoppingCart className="w-6 h-6" />
              <span className="text-[10px] font-medium">购物车</span>
            </button>
          </div>
          <div className="flex flex-1 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 h-11 rounded-full border border-pink-600 text-pink-600 bg-transparent font-bold text-sm hover:bg-pink-600/5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {addingToCart && <Loader2 className="w-4 h-4 animate-spin" />}
              加入购物车
            </button>
            <button
              onClick={handleBuyNow}
              disabled={addingToCart}
              className="flex-1 h-11 rounded-full bg-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:bg-pink-600/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
