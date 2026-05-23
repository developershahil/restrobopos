import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Utensils, Building, ChevronRight } from 'lucide-react';
import { setSession } from '@shared/utils/auth';
import { useBrandStore } from '@shared/store/useBrandStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Login, 2 = Select Brand
  const brands = useBrandStore(state => state.brands);
  const setActiveBrand = useBrandStore(state => state.setActiveBrand);

  const handleLogin = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSelectBrand = (brandId) => {
    setActiveBrand(brandId);
    setSession();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 font-sans relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-4 transform hover:scale-105 transition-transform duration-300">
            <Utensils className="text-primary-foreground w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Restrobopos</h2>
          <p className="text-muted-foreground text-sm font-medium mt-1">Management Suite</p>
        </div>

        {/* Login/Outlet Card */}
        <div className="bg-card border border-border/50 rounded-3xl shadow-xl shadow-black/[0.03] p-8">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-foreground">
              {step === 1 ? 'Welcome Back' : 'Select Restaurant Brand'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {step === 1 ? 'Please enter your credentials to login.' : 'Choose the brand you want to manage.'}
            </p>
          </div>

          {step === 1 ? (

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Business Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@restrobopos.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                  <input 
                    required
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full group relative flex items-center justify-center gap-2 h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all overflow-hidden mt-6"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span>Login securely</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          ) : (
            <div className="space-y-3">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => handleSelectBrand(brand.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary hover:shadow-md transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${brand.color} flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform`}>
                      {brand.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">Click to manage</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs font-medium text-muted-foreground mt-8">
          © {new Date().getFullYear()} Restrobopos. All rights reserved.
        </p>
      </div>
    </div>
  );
}
