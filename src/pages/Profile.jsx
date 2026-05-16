import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, Key, Smartphone, MonitorSmartphone, Mail, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border bg-card shrink-0 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 border border-border bg-background rounded-xl hover:bg-muted transition-colors shadow-sm shrink-0"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-tight">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account settings, security, and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-background p-4 flex flex-row md:flex-col gap-2 shrink-0 overflow-x-auto md:overflow-y-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'personal' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Shield className="w-4 h-4" /> Security
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'sessions' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <MonitorSmartphone className="w-4 h-4" /> Active Sessions
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 bg-card">
          <div className="max-w-3xl">
            
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold border-b border-border pb-2 mb-6">Personal Information</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-black text-primary-foreground shadow-lg border-4 border-background">
                      JD
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-muted text-foreground font-bold text-sm rounded-lg border border-border hover:bg-muted/80 transition-colors shadow-sm mb-2">
                        Upload New Photo
                      </button>
                      <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">First Name</label>
                      <input type="text" defaultValue="John" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Last Name</label>
                      <input type="text" defaultValue="Doe" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary font-medium" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-bold text-muted-foreground">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                        <input type="email" defaultValue="john.doe@restrobopos.com" className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg outline-none focus:border-primary font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-sm font-bold text-muted-foreground">Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full p-3 bg-background border border-border rounded-lg outline-none focus:border-primary font-medium" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border">
                  <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h2 className="text-xl font-bold border-b border-border pb-2 mb-6">Change Password</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Current Password</label>
                      <div className="relative">
                        <Key className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                        <input type="password" placeholder="Enter current password" className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                        <input type="password" placeholder="Enter new password" className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-muted-foreground">Confirm New Password</label>
                      <div className="relative">
                        <CheckCircle2 className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
                        <input type="password" placeholder="Confirm new password" className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                      </div>
                    </div>
                    <button className="mt-4 px-6 py-2.5 bg-background border border-border text-foreground font-bold rounded-lg shadow-sm hover:bg-muted transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <h2 className="text-xl font-bold border-b border-border pb-2 mb-6">Two-Factor Authentication (2FA)</h2>
                  <div className="flex items-start justify-between bg-muted/30 p-4 rounded-xl border border-border">
                    <div className="pr-4">
                      <h3 className="font-bold text-foreground flex items-center gap-2"><Smartphone className="w-4 h-4" /> Authenticator App</h3>
                      <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account. We recommend using Google Authenticator or Authy.</p>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-lg shadow-sm shrink-0">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold border-b border-border pb-2 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {/* Daily Summary */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">Daily Sales Summary</h4>
                      <p className="text-sm text-muted-foreground">Receive a daily email with sales and operational metrics.</p>
                    </div>
                    <div className="w-14 h-7 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-8 top-1 shadow-sm"></div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Failed Orders Alert */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">Critical Operational Alerts</h4>
                      <p className="text-sm text-muted-foreground">SMS alerts when high volume of orders fail or gateways go down.</p>
                    </div>
                    <div className="w-14 h-7 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-8 top-1 shadow-sm"></div>
                    </div>
                  </div>

                  <hr className="border-border" />

                  {/* Staff Updates */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">New Device Login Alerts</h4>
                      <p className="text-sm text-muted-foreground">Email notification whenever your account is accessed from a new device.</p>
                    </div>
                    <div className="w-14 h-7 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-8 top-1 shadow-sm"></div>
                    </div>
                  </div>
                  
                  <hr className="border-border" />

                  {/* Marketing */}
                  <div className="flex items-center justify-between opacity-70">
                    <div>
                      <h4 className="font-bold text-foreground">Restrobopos Updates & News</h4>
                      <p className="text-sm text-muted-foreground">Product updates, new features, and SaaS announcements.</p>
                    </div>
                    <div className="w-14 h-7 bg-muted-foreground/30 rounded-full relative cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold border-b border-border pb-2 mb-6">Active Sessions</h2>
                
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <MonitorSmartphone className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-bold text-foreground flex items-center gap-2">MacBook Pro 16" <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border border-green-200">Current Session</span></h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Browser on macOS • Bangalore, India</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">Active right now</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Smartphone className="w-6 h-6 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-bold text-foreground">iPhone 14 Pro</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Safari on iOS 17 • Mumbai, India</p>
                      <p className="text-xs font-medium text-muted-foreground mt-1">Last active: 2 hours ago</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 border border-border text-sm font-bold bg-muted hover:bg-muted/80 rounded-lg transition-colors text-foreground shadow-sm">
                    Log Out
                  </button>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors">
                    Log Out of All Devices
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
