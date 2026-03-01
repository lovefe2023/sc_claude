import { ArrowLeft, Smartphone, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickLogin() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 font-sans min-h-screen flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[480px] bg-white shadow-xl min-h-screen flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 z-10 relative">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 text-slate-900 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-slate-900 text-sm font-medium opacity-60">登录</div>
        </div>

        <div className="w-full px-6 py-4 flex justify-center">
          <div className="w-full aspect-[4/3] rounded-2xl bg-cover bg-center shadow-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800')" }}>
            <div className="w-full h-full bg-gradient-to-t from-white/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 pt-2 pb-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              欢迎来到 <span className="text-pink-600">礼品商城</span>
            </h1>
            <p className="text-slate-500 text-sm">
              登录发现专属奖励
            </p>
          </div>

          <div className="space-y-6 w-full">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 ml-1">
                手机号码
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Smartphone className="text-slate-400 group-focus-within:text-pink-600 transition-colors" />
                </div>
                <input 
                  type="tel" 
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-600/20 focus:border-pink-600 transition-all text-base font-medium" 
                  placeholder="请输入手机号" 
                />
              </div>
            </div>

            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center pt-0.5">
                <input 
                  type="checkbox" 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-pink-600 checked:bg-pink-600 hover:border-pink-600" 
                />
                <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
              </div>
              <div className="text-sm text-slate-500 select-none">
                我已阅读并同意 <button className="text-pink-600 font-semibold hover:underline">服务条款</button> 和 <button className="text-pink-600 font-semibold hover:underline">隐私政策</button>
              </div>
            </label>

            <button onClick={() => navigate('/')} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-600/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group">
              <span>下一步</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-400">其他登录方式</span>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button className="flex items-center gap-3 bg-[#07c160]/10 hover:bg-[#07c160]/20 active:bg-[#07c160]/30 border border-[#07c160]/20 transition-all rounded-full px-6 py-3">
              <svg className="w-6 h-6 text-[#07c160]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5,14.5 C10.6,14.5 12.4,15.8 13.1,17.6 C14.3,17.3 15.6,17.4 16.7,18 C17.8,18.6 18.5,19.6 18.5,20.8 C18.5,22.5 16.8,24 14.5,24 C14.1,24 13.7,24 13.3,23.9 L12,24.5 L12.1,23.1 C10,22.7 8.5,21.3 8.5,19.7 C8.5,19.5 8.5,19.4 8.5,19.2 C6.2,18.4 4.5,16.6 4.5,14.5 C4.5,11.5 7.4,9 11,9 C11.5,9 12,9.1 12.5,9.2 C12.8,4.7 16.8,1 21.5,1 C26.7,1 31,4.6 31,9 C31,11.8 29.5,14.2 27.2,15.6 L27.4,17.5 L25.5,16.5 C24.9,16.8 24.2,16.9 23.5,16.9 C23.2,16.9 22.8,16.9 22.5,16.9 C21.8,15.5 20.3,14.5 18.5,14.5 C18.5,14.5 18.5,14.5 8.5,14.5 Z M10,20.5 C10.4,20.5 10.8,20.9 10.8,21.3 C10.8,21.7 10.4,22.1 10,22.1 C9.6,22.1 9.2,21.7 9.2,21.3 C9.2,20.9 9.6,20.5 10,20.5 Z M15.5,20.5 C15.9,20.5 16.3,20.9 16.3,21.3 C16.3,21.7 15.9,22.1 15.5,22.1 C15.1,22.1 14.7,21.7 14.7,21.3 C14.7,20.9 15.1,20.5 15.5,20.5 Z M20,6 C20.8,6 21.5,6.7 21.5,7.5 C21.5,8.3 20.8,9 20,9 C19.2,9 18.5,8.3 18.5,7.5 C18.5,6.7 19.2,6 20,6 Z M27,6 C27.8,6 28.5,6.7 28.5,7.5 C28.5,8.3 27.8,9 27,9 C26.2,9 25.5,8.3 25.5,7.5 C25.5,6.7 26.2,6 27,6 Z" transform="scale(0.6) translate(8,8)"></path>
              </svg>
              <span className="text-[#07c160] font-semibold text-sm">微信登录</span>
            </button>
          </div>

          <div className="mt-auto text-center pb-2">
            <p className="text-xs text-slate-400">© 2024 Gift Mall Inc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
