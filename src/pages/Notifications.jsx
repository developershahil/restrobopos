import { useState } from 'react';
import { 
  Search, Bell, Filter, 
  RefreshCcw, Copy, Trash2, Calendar, Smartphone,
  ChevronLeft, ChevronRight, Send,
  Clock
} from 'lucide-react';
import NotificationDrawer from '../components/notifications/NotificationDrawer';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Buy One Get One Free!',
    description: 'Big Size Best Pizza ever! Enjoy the best deal of the day.',
    type: 'Offer',
    targetScreen: 'Offers',
    createdAt: '07-05-2026 03:37 pm',
    status: 'Sent',
    reach: 1240
  },
  {
    id: 2,
    title: 'IPL Special',
    description: 'Stadium Wall Feel! Watch the match with our special combo.',
    type: 'Promotion',
    targetScreen: 'Home',
    createdAt: '06-05-2026 01:20 pm',
    status: 'Scheduled',
    reach: 0
  },
  {
    id: 3,
    title: 'Happy Friday!',
    description: 'Free Delivery on all orders above $20.',
    type: 'Information',
    targetScreen: 'Home',
    createdAt: '05-05-2026 07:21 pm',
    status: 'Sent',
    reach: 850
  },
  {
    id: 4,
    title: 'New Store Launch',
    description: 'Visit our new outlet at Downtown and get 50% off.',
    type: 'Announcement',
    targetScreen: 'Stores',
    createdAt: '04-05-2026 11:45 am',
    status: 'Sent',
    reach: 3200
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const handleCreateNew = () => {
    setSelectedNotification(null);
    setIsDrawerOpen(true);
  };

  const handleSaveNotification = (data) => {
    if (data.id) {
      setNotifications(prev => prev.map(n => n.id === data.id ? { ...n, ...data } : n));
    } else {
      const newNotif = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleString(),
        status: data.isScheduled ? 'Scheduled' : 'Sent',
        reach: data.targeting === 'all' ? 12450 : 420
      };
      setNotifications(prev => [newNotif, ...prev]);
      setCurrentPage(1);
    }
    setIsDrawerOpen(false);
  };

  const handleDuplicate = (notif) => {
    setSelectedNotification({ ...notif, id: null }); // Remove ID to treat as new
    setIsDrawerOpen(true);
  };

  const handleResend = (notif) => {
    if (window.confirm(`Do you want to resend "${notif.title}" now?`)) {
      const resentNotif = {
        ...notif,
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleString(),
        status: 'Sent'
      };
      setNotifications(prev => [resentNotif, ...prev]);
      setCurrentPage(1);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const filteredNotifications = notifications.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Send Notification</h1>
          <p className="text-sm font-bold text-muted-foreground">Manage and broadcast push notifications to your customers</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Bell className="w-5 h-5" />
          <span>New Notification</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sent', value: '12,450', icon: Send, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Avg. Open Rate', value: '18.5%', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Scheduled', value: '3', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</p>
              <p className="text-xl font-black text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors text-primary">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </button>
        </div>
      </div>

      {/* List View */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title & Description</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Created At</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Screen</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedNotifications.map((notif) => (
                <tr key={notif.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm font-bold text-foreground mb-0.5 cursor-pointer hover:text-primary transition-colors" onClick={() => { setSelectedNotification(notif); setIsDrawerOpen(true); }}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{notif.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {notif.isScheduled && notif.scheduledTime 
                        ? new Date(notif.scheduledTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : notif.createdAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                      {notif.targetScreen}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${notif.status === 'Sent' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <span className="text-xs font-medium text-foreground">{notif.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleResend(notif)}
                        className="p-1.5 hover:text-primary transition-colors" title="Resend"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDuplicate(notif)}
                        className="p-1.5 hover:text-primary transition-colors" title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(notif.id)}
                        className="p-1.5 hover:text-red-500 transition-colors" title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNotifications.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground font-medium">
                    No notifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <p className="text-xs font-bold text-muted-foreground">
            Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredNotifications.length)}–{Math.min(currentPage * PAGE_SIZE, filteredNotifications.length)} of {filteredNotifications.length} notifications
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-black shadow-sm transition-colors ${
                  p === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialData={selectedNotification}
        onSave={handleSaveNotification}
      />
    </div>
  );
}
