import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Utensils, Star, Quote } from 'lucide-react';
import { setSession } from '../utils/auth';

const QUOTES = [
  {
    text: "Good food is the foundation of genuine happiness.",
    author: "Auguste Escoffier"
  },
  {
    text: "To eat is a necessity, but to eat intelligently is an art.",
    author: "François de La Rochefoucauld"
  },
  {
    text: "Running a restaurant is like a Broadway show every single night.",
    author: "Danny Meyer"
  }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setSession();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden font-sans">
      {/* Left Side: Visual & Quotes */}
      <div className="relative w-full md:w-1/2 lg:w-3/5 h-64 md:h-screen bg-neutral-900 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-1/4 w-full h-full bg-primary/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/4 w-full h-full bg-primary/10 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
        </div>

        {/* Branding Overlay */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Utensils className="text-primary-foreground w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-none">Restrobopos</h2>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Management Suite</p>
          </div>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 z-10">
          <div className={`transition-all duration-500 transform ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <Quote className="text-primary w-12 h-12 mb-6 opacity-50" />
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
              "{QUOTES[quoteIndex].text}"
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-primary"></div>
              <p className="text-lg font-bold text-neutral-400">— {QUOTES[quoteIndex].author}</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-12">
            {QUOTES.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 transition-all duration-500 rounded-full ${i === quoteIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-card relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Star size={12} className="animate-spin-slow" /> Version 2.4.0 Live
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-none">Welcome Back</h1>
            <p className="text-muted-foreground font-medium">Elevate your restaurant management experience.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-1">Business Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@restrobopos.com"
                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border-2 border-transparent rounded-2xl outline-none focus:border-primary/50 focus:bg-background transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border-2 border-transparent rounded-2xl outline-none focus:border-primary/50 focus:bg-background transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-muted-foreground text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-sm font-bold text-muted-foreground cursor-pointer">Remember this device</label>
            </div>

            <button 
              type="submit" 
              className="w-full group relative flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              Log Into Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
