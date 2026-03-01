import { ArrowLeft, Store, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 font-sans min-h-screen flex flex-col antialiased">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center text-slate-900 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900">我的订单</h1>
          <div className="w-8"></div> 
        </div>
        
        {/* Tabs */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex min-w-full px-4 border-b border-slate-200">
            <button className="flex-none px-4 py-3 text-sm font-bold text-pink-600 border-b-[3px] border-pink-600 whitespace-nowrap">
              全部
            </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap">
              待付款
            </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap">
              待发货
            </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap">
              待收货
            </button>
            <button className="flex-none px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent whitespace-nowrap">
              已完成
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Order 1 */}
        <div className="bg-white rounded-xl shadow-sm p-4 cursor-pointer" onClick={() => navigate('/order/1')}>
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-900">自然臻选礼品店</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-bold text-pink-600">待付款</span>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=200')" }}></div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mb-1">有机特级茶礼盒套装</h3>
                <p className="text-xs text-slate-500">绿茶 & 茉莉花 • 礼盒装</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-400">x 1</div>
                <div className="text-base font-bold text-slate-900">¥45.00</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-end items-center gap-1 text-sm text-slate-900">
              <span className="text-slate-500">合计:</span>
              <span className="font-bold">¥45.00</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">
                取消订单
              </button>
              <button className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-medium shadow-sm shadow-pink-600/30 hover:bg-pink-700">
                去支付
              </button>
            </div>
          </div>
        </div>

        {/* Order 2 */}
        <div className="bg-white rounded-xl shadow-sm p-4 cursor-pointer" onClick={() => navigate('/order/2')}>
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-900">奢华尚品</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-bold text-pink-600">待发货</span>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=200')" }}></div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mb-1">意大利真丝围巾 - 午夜蓝</h3>
                <p className="text-xs text-slate-500">尺寸: 标准 • 颜色: 蓝色</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-400">x 1</div>
                <div className="text-base font-bold text-slate-900">¥128.00</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-end items-center gap-1 text-sm text-slate-900">
              <span className="text-slate-500">合计:</span>
              <span className="font-bold">¥128.00</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">
                提醒发货
              </button>
            </div>
          </div>
        </div>

        {/* Order 3 */}
        <div className="bg-white rounded-xl shadow-sm p-4 cursor-pointer" onClick={() => navigate('/order/3')}>
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-900">甜蜜时光官方店</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-bold text-pink-600">待收货</span>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=200')" }}></div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mb-1">精选比利时巧克力礼盒</h3>
                <p className="text-xs text-slate-500">24粒装 • 黑巧 & 牛奶</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-400">x 2</div>
                <div className="text-base font-bold text-slate-900">¥89.00</div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=200')" }}></div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mb-1">法式马卡龙精选</h3>
                <p className="text-xs text-slate-500">12枚入 • 混合口味</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-400">x 1</div>
                <div className="text-base font-bold text-slate-900">¥32.00</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-end items-center gap-1 text-sm text-slate-900">
              <span className="text-slate-500">合计 (3件):</span>
              <span className="font-bold">¥210.00</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">
                查看物流
              </button>
              <button className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-medium shadow-sm shadow-pink-600/30 hover:bg-pink-700">
                确认收货
              </button>
            </div>
          </div>
        </div>

        {/* Order 4 */}
        <div className="bg-white rounded-xl shadow-sm p-4 cursor-pointer" onClick={() => navigate('/order/4')}>
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-900">科技数码港</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-500">已完成</span>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200')" }}></div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight truncate mb-1">无线降噪耳机</h3>
                <p className="text-xs text-slate-500">哑光黑 • 耳罩式</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-400">x 1</div>
                <div className="text-base font-bold text-slate-900">¥249.00</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-end items-center gap-1 text-sm text-slate-900">
              <span className="text-slate-500">合计:</span>
              <span className="font-bold">¥249.00</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">
                查看发票
              </button>
              <button className="px-4 py-2 rounded-full border border-pink-600 text-pink-600 text-sm font-medium bg-pink-50 hover:bg-pink-100">
                再次购买
              </button>
            </div>
          </div>
        </div>

        <div className="h-8 flex items-center justify-center">
          <p className="text-xs text-slate-400">没有更多订单了</p>
        </div>
      </main>
    </div>
  );
}
