import { Hash, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onlineUsers: Record<string, { username: string; status: 'online' | 'offline' }>;
  onLogout: () => void;
  activeChannel: string;
  onChannelSelect: (channel: string) => void;
}

export default function ChatSidebar({ isOpen, onClose, username, onlineUsers, onLogout, activeChannel, onChannelSelect }: SidebarProps) {
  const onlineList = Object.entries(onlineUsers).filter(([_, info]) => info.status === 'online' && info.username !== username);
  
  return (
    <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 lg:relative lg:flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Hash size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">SocketChat</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <button className="hidden lg:block p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Channels</h3>
            <button className="text-gray-400 hover:text-blue-600">+</button>
          </div>
          <div className="space-y-1">
            {['general', 'engineering', 'design', 'support'].map((ch) => (
              <button
                key={ch}
                onClick={() => onChannelSelect(ch)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  ch === activeChannel 
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Hash size={18} className={ch === activeChannel ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-bold tracking-tight">{ch}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Members</h3>
          </div>
          <div className="space-y-1">
            {onlineList.length > 0 ? (
              onlineList.map(([id, info]) => (
                <button 
                  key={id} 
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-bold text-sm tracking-tight text-left"
                >
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-[10px] font-black uppercase">
                      {info.username.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                  </div>
                  <span className="truncate">{info.username}</span>
                </button>
              ))
            ) : (
                <p className="px-3 py-2 text-xs text-gray-400 font-medium italic">No other members online</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 border-t border-gray-100">
        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-inner shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Online</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
