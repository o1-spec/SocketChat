'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, User, Hash, Settings, Search, MoreVertical, Paperclip, Smile, LogOut, X, AlertTriangle, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('User_' + Math.floor(Math.random() * 1000));
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    // In a real app, clear tokens/session here
    router.push('/');
  };

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket) {
      socket.emit('message', {
        text: input,
        sender: username,
      });
      setInput('');
    }
  };

  return (
    <div className="flex h-screen bg-white md:bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Channels/DMs */}
      <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Hash size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">SocketChat</span>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    ch === 'general' 
                      ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-50' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Hash size={18} className={ch === 'general' ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="text-sm font-bold tracking-tight">{ch}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between px-2 mb-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Reports</h3>
            </div>
            <div className="space-y-1">
              {[ 'Monthly Stats', 'User Growth'].map((dm) => (
                <button key={dm} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-bold text-sm tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200" />
                  {dm}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-inner shrink-0">
                {username.charAt(0)}
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
              onClick={() => setShowLogoutModal(true)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal Overlay */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-4xl shadow-2xl p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Logout</h3>
              <p className="text-gray-500 text-sm mb-8 font-medium font-sans">Are you sure you want to logout? You will need to sign in again to continue.</p>
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-red-100 font-sans"
                >
                  Yes, Log out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl font-bold transition-all active:scale-[0.98] font-sans"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="h-20 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="lg:hidden w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Hash size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-gray-900 tracking-tight">#general</h2>
                <span className="hidden md:inline px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-md uppercase tracking-wider">Public</span>
              </div>
              <p className="text-xs text-gray-400 font-medium truncate">The default channel for everything</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-xs w-24 md:w-40 font-medium" />
            </div>
            <div className="h-6 w-px bg-gray-100 mx-1 hidden md:block" />
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-8 bg-gray-50/30">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="w-20 h-20 bg-white shadow-xl shadow-gray-100 rounded-[2.5rem] flex items-center justify-center rotate-6 scale-110">
                <MessageSquare size={36} className="text-blue-600 -rotate-6" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">Quiet in here...</p>
                <p className="text-sm text-gray-400 font-medium mt-2 max-w-50 mx-auto">Be the one to break the ice and start a conversation!</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isLocal = msg.sender === username;
            return (
              <div key={msg.id} className={`flex ${isLocal ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isLocal ? 'items-end' : 'items-start'}`}>
                  {!isLocal && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <div className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {msg.sender.charAt(0)}
                      </div>
                      <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
                        {msg.sender}
                      </span>
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 md:px-6 md:py-4 rounded-4xl shadow-sm text-sm leading-relaxed transition-all duration-200 font-medium ${
                      isLocal
                        ? 'bg-blue-600 text-white rounded-tr-none hover:bg-blue-700 shadow-blue-100'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none hover:border-blue-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[10px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest ${isLocal ? 'mr-2' : 'ml-8'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 md:p-8 bg-white border-t border-gray-100">
          <form onSubmit={sendMessage} className="max-w-5xl mx-auto relative">
            <div className="flex items-center gap-3 bg-gray-50 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white rounded-4xl p-2 pr-4 transition-all duration-300 shadow-inner">
              <button type="button" className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type a message in #general...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base py-3 text-gray-800 placeholder-gray-400 font-medium"
              />
              <button type="button" className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all hidden sm:flex">
                <Smile size={20} />
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-3.5 rounded-full transition-all shadow-lg active:scale-95 ${
                  input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
