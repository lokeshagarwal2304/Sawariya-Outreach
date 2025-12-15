import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCircle2, Mail, Lock } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Animation states
  const [isPageExit, setIsPageExit] = useState(false);
  const [isFormSwitching, setIsFormSwitching] = useState(false);

  const toggleAuthMode = () => {
    setIsFormSwitching(true);
    // Wait for exit animation before switching state
    setTimeout(() => {
        setIsLogin(!isLogin);
        setIsFormSwitching(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPageExit(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin({ name: name || 'User', email });
    }, 800);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0f1117] transition-opacity duration-700 ${isPageExit ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-5xl h-[600px] bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex border border-gray-800">
        
        {/* Visual Side */}
        <div className="hidden md:flex w-1/2 relative bg-purple-900 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/90 to-blue-900/40"></div>
          
          <div className="relative z-10 text-center p-12">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl inline-block mb-6 shadow-xl border border-white/10 animate-fade-in-up">
              <Sparkles className="w-12 h-12 text-purple-300" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Sawariya Outreach</h1>
            <p className="text-purple-200 text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Unlock AI-driven insights from the global tech pulse. Visualize trends, classify content, and generate assets in one unified platform.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gray-900 relative overflow-hidden">
          <div className={`transition-all duration-300 ease-in-out transform ${isFormSwitching ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
              <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Join the Future'}</h2>
              <p className="text-gray-400 mb-8">{isLogin ? 'Enter your credentials to access the dashboard.' : 'Create an account to start analyzing trends.'}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative group animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <UserCircle2 className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all hover:bg-gray-800"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="relative group animate-fade-in-up" style={{ animationDelay: isLogin ? '0ms' : '100ms' }}>
                  <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all hover:bg-gray-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative group animate-fade-in-up" style={{ animationDelay: isLogin ? '100ms' : '200ms' }}>
                  <Lock className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all hover:bg-gray-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 mt-6 group animate-fade-in-up"
                  style={{ animationDelay: isLogin ? '200ms' : '300ms' }}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: isLogin ? '300ms' : '400ms' }}>
                <p className="text-gray-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    type="button"
                    onClick={toggleAuthMode} 
                    className="ml-2 text-purple-400 hover:text-purple-300 font-medium transition-colors focus:outline-none"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
