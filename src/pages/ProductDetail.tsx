import { ArrowLeft, Share2, Flame, ChevronRight, MapPin, Star, HeadphonesIcon, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductDetail() {
  const navigate = useNavigate();

  const images = [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800',
  ];

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
            style={{ backgroundImage: `url(${images[0]})` }}
          ></div>
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            1/4
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex w-full overflow-x-auto no-scrollbar px-4 py-4 gap-3 bg-white border-b border-pink-600/10">
          {images.map((img, idx) => (
            <div key={idx} className={`flex-shrink-0 w-20 aspect-square rounded-lg border-2 ${idx === 0 ? 'border-pink-600' : 'border-transparent opacity-70'} overflow-hidden cursor-pointer`}>
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}></div>
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="bg-white px-4 py-5 mb-2">
          <h1 className="text-2xl font-bold leading-tight text-slate-900 mb-3">精选生日礼盒 - 定制惊喜版</h1>
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-pink-600">¥49.99</span>
              <span className="text-base text-slate-500 line-through decoration-slate-400">¥89.99</span>
            </div>
            <div className="flex items-center gap-1 bg-pink-600/5 px-2 py-1 rounded text-xs text-pink-600 font-medium">
              <Flame className="w-4 h-4" />
              <span>已售 2.3k</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium border border-green-200">包邮</div>
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
            <p>用我们的精选生日礼盒给您的亲人一个惊喜。精心策划，这个礼盒包含了一系列我们最好的商品，旨在带来欢乐和兴奋。</p>
            <div className="w-full rounded-lg overflow-hidden my-4">
              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800" alt="Detail 1" className="w-full h-auto object-cover" />
            </div>
            <p>每个礼盒都采用优质材料和精美的展示。非常适合生日、周年纪念日，或者仅仅是为了表达心意。</p>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-slate-900">
              <li>手工包装，配有优质丝带</li>
              <li>包含可定制的贺卡</li>
              <li>环保包装材料</li>
              <li>内含惊喜神秘物品</li>
            </ul>
            <div className="w-full rounded-lg overflow-hidden my-4">
              <img src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=800" alt="Detail 2" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white px-4 py-6 mt-2 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">评价 (128)</h3>
            <div className="flex items-center text-pink-600 text-sm font-medium cursor-pointer">
              查看全部 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-pink-600/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100')" }}></div>
                <span className="text-sm font-bold">莎拉 M.</span>
              </div>
              <div className="flex text-yellow-400 text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-600">"绝对喜欢！包装精致，内容物质量上乘。会再次购买！"</p>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pink-600/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <div className="max-w-md mx-auto w-full px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-4 mr-2">
            <button className="flex flex-col items-center justify-center gap-1 min-w-[40px] text-slate-500 hover:text-pink-600 transition-colors">
              <HeadphonesIcon className="w-6 h-6" />
              <span className="text-[10px] font-medium">客服</span>
            </button>
            <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center gap-1 min-w-[40px] text-slate-500 hover:text-pink-600 transition-colors relative">
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
              <ShoppingCart className="w-6 h-6" />
              <span className="text-[10px] font-medium">购物车</span>
            </button>
          </div>
          <div className="flex flex-1 gap-2">
            <button className="flex-1 h-11 rounded-full border border-pink-600 text-pink-600 bg-transparent font-bold text-sm hover:bg-pink-600/5 active:scale-95 transition-all">
              加入购物车
            </button>
            <button onClick={() => navigate('/checkout')} className="flex-1 h-11 rounded-full bg-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-600/30 hover:bg-pink-600/90 active:scale-95 transition-all">
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
