import { useState } from 'react';
import { ArrowLeft, Smartphone, Lock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('请填写手机号和密码');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(phone, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md h-full min-h-screen flex flex-col bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 z-10">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full text-slate-900 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="text-2xl" />
          </button>
          <div className="w-10"></div>
        </div>

        <div className="w-full flex justify-center py-6 px-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-600/10 to-pink-600/30 flex items-center justify-center p-6 mb-4">
            <div className="w-full h-full bg-contain bg-center bg-no-repeat flex items-center justify-center">
              <span className="text-2xl font-bold text-pink-600">Gift Mall</span>
            </div>
          </div>
        </div>

        <div className="w-full px-8">
          <div className="flex border-b border-slate-200">
            <button className="flex-1 flex flex-col items-center pb-3 border-b-[3px] border-pink-600 text-pink-600">
              <span className="text-lg font-bold">登录</span>
            </button>
            <button onClick={() => navigate('/quick-login')} className="flex-1 flex flex-col items-center pb-3 border-b-[3px] border-transparent text-slate-500 hover:text-slate-700 transition-colors">
              <span className="text-lg font-bold">注册</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex-1 px-8 pt-8 flex flex-col gap-5">
          <div className="relative">
            <label htmlFor="phone" className="sr-only">手机号</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Smartphone className="text-slate-400" />
            </div>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border-slate-200 rounded-lg text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-pink-600 focus:border-pink-600 sm:text-sm"
              placeholder="请输入手机号"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">密码</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-4 border-slate-200 rounded-lg text-slate-900 bg-slate-50 placeholder:text-slate-400 focus:ring-2 focus:ring-pink-600 focus:border-pink-600 sm:text-sm"
              placeholder="请输入密码"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <Eye />
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div className="flex justify-end">
            <button type="button" className="text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors">
              忘记密码？
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full shadow-lg shadow-pink-600/30 transition-all transform active:scale-[0.98] mt-2 disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? '登录中...' : '登录'}
          </button>

          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-600 mt-1"
            />
            <label htmlFor="terms" className="text-xs text-slate-500">
              我已阅读并同意 <button type="button" className="text-pink-600 hover:underline">《服务条款》</button> 和 <button type="button" className="text-pink-600 hover:underline">《隐私政策》</button>。
            </label>
          </div>
        </form>

        <div className="px-8 pb-10 mt-auto">
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider">其他登录方式</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center gap-6">
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 bg-white text-[#07C160] hover:bg-slate-50 transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 13.5C8.5 14.3284 9.17157 15 10 15C10.8284 15 11.5 14.3284 11.5 13.5C11.5 12.6716 10.8284 12 10 12C9.17157 12 8.5 12.6716 8.5 13.5Z"></path>
                <path d="M15.5 5.5C14.6716 5.5 14 6.17157 14 7C14 7.82843 14.6716 8.5 15.5 8.5C16.3284 8.5 17 7.82843 17 7C17 6.17157 16.3284 5.5 15.5 5.5Z"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M12.9815 11.4068C12.6586 11.4385 12.3323 11.4547 12.0035 11.4547C11.666 11.4547 11.3312 11.4377 11.0001 11.4045C10.5975 14.0772 8.12596 16.0826 5.25056 16.0826C4.69781 16.0826 4.16279 16.0076 3.65215 15.8661L1.10915 17.1376L1.69618 14.5445C0.639454 13.6231 0 12.4344 0 11.1374C0 8.22556 2.68629 5.86475 6 5.86475C6.18241 5.86475 6.36243 5.87225 6.53995 5.88691C6.98393 2.58557 10.0381 0 13.6364 0C17.702 0 21 2.87198 21 6.41461C21 9.95724 17.702 12.8292 13.6364 12.8292C12.8344 12.8292 12.0645 12.7032 11.3409 12.4691L10.027 14.288L10.6358 12.5978C11.3663 12.8719 12.1643 13.018 13.0001 13.018C13.2206 13.018 13.4383 13.0079 13.6528 12.9882C13.5656 12.4837 13.3441 12.0163 13.0242 11.6047C13.0097 11.5397 12.9955 11.4735 12.9815 11.4068ZM7.5 7C7.5 6.17157 6.82843 5.5 6 5.5C5.17157 5.5 4.5 6.17157 4.5 7C4.5 7.82843 5.17157 8.5 6 8.5C6.82843 8.5 7.5 7.82843 7.5 7Z"></path>
              </svg>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.05 3.96-.71 1.06.23 2.14.88 2.87 1.88-2.61 1.6-2.08 5.76.61 7.15-.55 1.55-1.28 2.95-2.52 3.91zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
