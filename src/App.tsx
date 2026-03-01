import { BrowserRouter, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Grid, ShoppingCart, User } from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

import Home from './pages/Home';
import CategoryPage from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import QuickLogin from './pages/QuickLogin';
import ProductList from './pages/ProductList';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const navItems = [
    { path: '/', icon: HomeIcon, label: '首页' },
    { path: '/category', icon: Grid, label: '分类' },
    { path: '/cart', icon: ShoppingCart, label: '购物车', badge: totalItems > 0 ? totalItems : undefined },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-16 no-scrollbar">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 flex justify-around items-center py-2 pb-safe z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 flex-1 ${
                isActive ? 'text-pink-600' : 'text-slate-400 hover:text-pink-600'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold px-1 min-w-[16px] h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/order/:id" element={<OrderDetail />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quick-login" element={<QuickLogin />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
