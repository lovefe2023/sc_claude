import { useEffect, useState } from 'react';
import { Settings, Edit2, ChevronRight, Wallet, Package, Truck, CheckCircle, RotateCcw, MapPin, Ticket, Heart, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, OrderStats, Coupon } from '../api/client';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<OrderStats>({ unpaid: 0, unshipped: 0, shipped: 0, completed: 0, refund: 0 });
  const [couponCount, setCouponCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [orderStats, coupons] = await Promise.all([
        api.orders.getStats(user.id),
        api.coupons.getUserCoupons(user.id),
      ]);
      setStats(orderStats);
      setCouponCount(coupons.length);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Header & User Info */}
        <div className="bg-white pb-6 pt-4 px-4 rounded-b-xl shadow-sm mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold tracking-tight">个人中心</h1>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          {user ? (
            <>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="h-20 w-20 rounded-full bg-slate-200 bg-cover bg-center border-2 border-pink-600/20"
                    style={{ backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : undefined }}
                  ></div>
                  <div className="absolute bottom-0 right-0 h-6 w-6 bg-pink-600 rounded-full flex items-center justify-center border-2 border-white">
                    <Edit2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{user.nickname}</h2>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <span>{user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-600/10 text-pink-600">
                      {user.member_level === 'gold' ? '金牌会员' : user.member_level === 'silver' ? '银牌会员' : '普通会员'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-around mt-6 border-t border-slate-100 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-slate-900">{couponCount}</span>
                  <span className="text-xs text-slate-500">优惠券</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-slate-900">{user.points}</span>
                  <span className="text-xs text-slate-500">积分</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-slate-900">0</span>
                  <span className="text-xs text-slate-500">关注</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-pink-600 text-white rounded-full font-medium"
              >
                登录 / 注册
              </button>
            </div>
          )}
        </div>

        {/* My Orders */}
        <div className="bg-white mx-4 rounded-xl shadow-sm mb-4 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">我的订单</h3>
            <button onClick={() => navigate('/orders')} className="text-xs text-slate-500 flex items-center hover:text-pink-600 transition-colors">
              全部订单
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            <button onClick={() => navigate('/orders?tab=unpaid')} className="flex flex-col items-center gap-2 group relative">
              <div className="relative p-2 rounded-full group-hover:bg-pink-600/5 transition-colors">
                <Wallet className="w-6 h-6 text-slate-600 group-hover:text-pink-600 transition-colors" />
                {stats.unpaid > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-pink-600 text-white text-[10px] flex items-center justify-center rounded-full border border-white">{stats.unpaid}</span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 font-medium leading-tight">待付款</span>
            </button>
            <button onClick={() => navigate('/orders?tab=unshipped')} className="flex flex-col items-center gap-2 group relative">
              <div className="relative p-2 rounded-full group-hover:bg-pink-600/5 transition-colors">
                <Package className="w-6 h-6 text-slate-600 group-hover:text-pink-600 transition-colors" />
                {stats.unshipped > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-pink-600 text-white text-[10px] flex items-center justify-center rounded-full border border-white">{stats.unshipped}</span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 font-medium leading-tight">待发货</span>
            </button>
            <button onClick={() => navigate('/orders?tab=shipped')} className="flex flex-col items-center gap-2 group relative">
              <div className="relative p-2 rounded-full group-hover:bg-pink-600/5 transition-colors">
                <Truck className="w-6 h-6 text-slate-600 group-hover:text-pink-600 transition-colors" />
              </div>
              <span className="text-[10px] text-slate-600 font-medium leading-tight">已发货</span>
            </button>
            <button onClick={() => navigate('/orders?tab=completed')} className="flex flex-col items-center gap-2 group relative">
              <div className="relative p-2 rounded-full group-hover:bg-pink-600/5 transition-colors">
                <CheckCircle className="w-6 h-6 text-slate-600 group-hover:text-pink-600 transition-colors" />
              </div>
              <span className="text-[10px] text-slate-600 font-medium leading-tight">已完成</span>
            </button>
            <button className="flex flex-col items-center gap-2 group relative">
              <div className="relative p-2 rounded-full group-hover:bg-pink-600/5 transition-colors">
                <RotateCcw className="w-6 h-6 text-slate-600 group-hover:text-pink-600 transition-colors" />
                {stats.refund > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-pink-600 text-white text-[10px] flex items-center justify-center rounded-full border border-white">{stats.refund}</span>
                )}
              </div>
              <span className="text-[10px] text-slate-600 font-medium leading-tight">退款/售后</span>
            </button>
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white mx-4 rounded-xl shadow-sm overflow-hidden mb-4">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">收货地址管理</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">我的优惠券</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-pink-600 font-medium">{couponCount} 张</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">我的收藏</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">帮助中心</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Banner */}
        <div className="mx-4 mb-4 rounded-xl overflow-hidden h-24 bg-gradient-to-r from-pink-600/80 to-purple-600 relative flex items-center px-6">
          <div className="z-10">
            <p className="text-white font-bold text-lg">邀请好友</p>
            <p className="text-white/80 text-xs">每邀请一位好友可得 ¥50 优惠券！</p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=300')] bg-cover opacity-20"></div>
        </div>
      </div>
    </div>
  );
}
