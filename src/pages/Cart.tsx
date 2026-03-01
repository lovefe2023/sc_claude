import { useEffect, useState } from 'react';
import { ArrowLeft, Store, ChevronRight, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, loading, totalPrice, updateQuantity, removeFromCart, refreshCart } = useCart();

  const handleQuantityChange = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
    } else {
      await updateQuantity(id, quantity);
    }
  };

  // Group items by store (simplified - all items are from "平台自营")
  const storeGroups = [
    {
      name: '平台自营',
      items: items,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-20 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold leading-tight flex-1 text-center">购物车 ({items.length})</h2>
          <button className="flex h-10 items-center justify-end px-2">
            <span className="text-pink-600 text-base font-bold">编辑</span>
          </button>
        </div>
      </header>

      {loading ? (
        <main className="flex-1 overflow-y-auto pb-32 flex items-center justify-center">
          <div className="text-slate-400">加载中...</div>
        </main>
      ) : items.length === 0 ? (
        <main className="flex-1 overflow-y-auto pb-32 flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-400 mb-4">购物车是空的</div>
            <button
              onClick={() => navigate('/')}
              className="text-pink-600 font-medium"
            >
              去逛逛
            </button>
          </div>
        </main>
      ) : (
        <main className="flex-1 overflow-y-auto pb-32">
          {storeGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mt-4 bg-white rounded-xl mx-4 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-2 border-slate-300 text-pink-600 focus:ring-0 checked:bg-pink-600 checked:border-pink-600 transition-all cursor-pointer" />
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-sm">{group.name}</h3>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {group.items.map((item) => (
                <div key={item.id}>
                  <div className="group relative flex gap-3 p-4 transition-colors hover:bg-slate-50">
                    <div className="flex items-center justify-center pt-8">
                      <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-2 border-slate-300 text-pink-600 focus:ring-0 checked:bg-pink-600 checked:border-pink-600 transition-all cursor-pointer" />
                    </div>
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      <img
                        src={item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200'}
                        alt={item.product?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-medium leading-snug line-clamp-2 mb-1">{item.product?.name || '商品'}</h4>
                        {item.specifications && (
                          <div className="inline-flex items-center rounded bg-slate-50 px-2 py-1 text-xs text-slate-500 mb-2">
                            <span>规格: 已选</span>
                            <ChevronRight className="w-3 h-3 ml-1 rotate-90" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-pink-600">¥</span>
                          <span className="text-lg font-bold text-pink-600">{item.product?.price.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-slate-400 hover:text-pink-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-slate-400 hover:text-pink-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {groupIndex < storeGroups.length - 1 && <div className="h-px w-full bg-slate-100 ml-12"></div>}
                </div>
              ))}
            </div>
          ))}
          <div className="h-20"></div>
        </main>
      )}

      {/* Checkout Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 z-10 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="selectAll" defaultChecked className="h-5 w-5 rounded border-2 border-slate-300 text-pink-600 focus:ring-0 checked:bg-pink-600 checked:border-pink-600 transition-all cursor-pointer" />
            <label htmlFor="selectAll" className="text-sm font-medium text-slate-600 select-none cursor-pointer">全选</label>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium text-slate-900">合计:</span>
                <span className="text-lg font-bold text-pink-600">¥{totalPrice.toFixed(2)}</span>
              </div>
              <span className="text-xs text-slate-500">已包含优惠</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
              className="h-10 rounded-full bg-pink-600 px-6 text-sm font-bold text-white shadow-lg shadow-pink-600/30 active:scale-95 transition-transform hover:bg-pink-700 disabled:bg-slate-300 disabled:shadow-none"
            >
              去结算 ({items.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
