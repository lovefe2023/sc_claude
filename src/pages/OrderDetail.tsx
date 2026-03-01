import { ArrowLeft, MoreVertical, Truck, MapPin, HeadphonesIcon, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderDetail() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 shadow-2xl font-sans">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-3 shadow-sm transition-colors">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900">订单详情</h2>
        <button className="flex size-10 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 active:scale-95 transition-all">
          <MoreVertical className="w-6 h-6" />
        </button>
      </header>

      <div className="relative w-full bg-pink-600 px-6 py-8 overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-20">
          <Truck className="w-[140px] h-[140px] text-white" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">待收货</h2>
          <p className="text-white/90 text-sm font-medium">您的包裹正在配送中</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 -mt-4 max-w-md mx-auto w-full">
        {/* Address */}
        <div className="rounded-xl bg-white p-4 shadow-sm relative z-20">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-600/10 text-pink-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900">张三</span>
                <span className="text-sm text-slate-500">138-1234-5678</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                北京市朝阳区建国路88号SOHO现代城A座1001室
              </p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-slate-900">商品信息</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img src="https://images.unsplash.com/photo-1508656919602-0e21101b6197?auto=format&fit=crop&q=80&w=200" alt="Watch" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div>
                  <h4 className="text-sm font-medium leading-snug text-slate-900 line-clamp-2">极简智能手表 Series 5 - 玫瑰金版</h4>
                  <p className="mt-1 text-xs text-slate-500">颜色: 玫瑰金</p>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-pink-600">¥299.00</span>
                  <span className="text-sm text-slate-500">x1</span>
                </div>
              </div>
            </div>
            
            <div className="h-px w-full bg-slate-100"></div>
            
            <div className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200" alt="Perfume" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div>
                  <h4 className="text-sm font-medium leading-snug text-slate-900 line-clamp-2">花漾香氛淡香水 - 50ml 礼盒装</h4>
                  <p className="mt-1 text-xs text-slate-500">规格: 50ml</p>
                </div>
                <div className="flex items-end justify-between">
                  <span className="font-bold text-pink-600">¥85.00</span>
                  <span className="text-sm text-slate-500">x1</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">商品总额</span>
              <span className="font-medium text-slate-900">¥384.00</span>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">运费</span>
              <span className="font-medium text-slate-900">¥0.00</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-dashed border-slate-200 pt-3">
              <span className="text-base font-bold text-slate-900">实付款</span>
              <span className="text-lg font-bold text-pink-600">¥384.00</span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-slate-900">订单信息</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">订单编号</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">ORD-2023-8492</span>
                <button className="text-pink-600 hover:text-pink-700 transition-colors text-xs font-semibold">复制</button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">创建时间</span>
              <span className="font-medium text-slate-900">2023-10-24 14:30</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">支付时间</span>
              <span className="font-medium text-slate-900">2023-10-24 14:32</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">交易单号</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">TXN88392011</span>
                <button className="text-pink-600 hover:text-pink-700 transition-colors text-xs font-semibold">复制</button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2 pb-8">
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm active:scale-[0.98] transition-all">
            <HeadphonesIcon className="w-5 h-5" />
            联系客服
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm active:scale-[0.98] transition-all">
            <RefreshCcw className="w-5 h-5" />
            申请退款
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 w-full bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe max-w-md mx-auto">
        <button className="w-full rounded-full bg-pink-600 py-3.5 text-center text-base font-bold text-white shadow-md shadow-pink-600/30 active:scale-[0.99] transition-all">
          确认收货
        </button>
      </div>
    </div>
  );
}
