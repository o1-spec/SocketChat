'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Send, Hash, Search, MoreVertical, Paperclip, Smile, X, AlertTriangle, MessageSquare, Loader2, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import ChatSidebar from '@/components/ChatSidebar';
import MessageBubble from '@/components/MessageBubble';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
  file?: {
    url: string;
    name: string;
    type: string;
  };
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, checkAuth } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      await checkAuth(); // This will trigger the redirect in AuthContext
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Fetch message history
    const fetchHistory = async () => {
      try {
        const history = await apiFetch('/channels/general/messages');
        setMessages(history);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchHistory();

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Join the general channel by default
    newSocket.on('connect', () => {
      newSocket.emit('join_channel', 'general');
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && socket && user) {
      socket.emit('message', {
        text: input,
        sender: user.username,
        channel: 'general'
      });
      setInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socket || !user) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/upload/upload`, {
        method: 'POST',
        body: formData,
        // credentials: 'include' is handled if we use apiFetch but apiFetch expects JSON
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      
      socket.emit('message', {
        text: `Shared a file: ${file.name}`,
        sender: user.username,
        channel: 'general',
        file: {
          url: data.url,
          name: data.filename,
          type: data.type
        }
      });

      toast.success("File uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload file");
      console.error(err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (authLoading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  const username = user.username;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

  return (
    <div className="flex h-screen bg-white md:bg-gray-50 overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Channels/DMs */}
      <ChatSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        username={user.username}
        onLogout={() => setShowLogoutModal(true)}
      />

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
                  disabled={isLoggingOut}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-red-100 font-sans flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    "Yes, Log out"
                  )}
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
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
        <header className="h-20 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-4 overflow-hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex w-10 h-10 bg-blue-600 rounded-xl items-center justify-center shadow-lg shadow-blue-100">
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

          {messages.map((msg, idx) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isLocal={msg.sender === user.username} 
              backendUrl={backendUrl}
            />
          ))}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 md:p-8 bg-white border-t border-gray-100">
          <form onSubmit={sendMessage} className="max-w-5xl mx-auto relative">
            <div className="flex items-center gap-3 bg-gray-50 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white rounded-4xl p-2 pr-4 transition-all duration-300 shadow-inner">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              >
                {isUploading ? <Loader2 size={20} className="animate-spin text-blue-600" /> : <Paperclip size={20} />}
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
