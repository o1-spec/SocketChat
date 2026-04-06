'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, User, Hash, Settings, Search, MoreVertical, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: string;
}

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('User_' + Math.floor(Math.random() * 1000));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Channels/DMs */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hash size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">Dashboard</span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-md text-gray-400">
            <Settings size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Channels</h3>
            <div className="space-y-1">
              {['general', 'engineering', 'design', 'support'].map((ch) => (
                <button
                  key={ch}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-md transition ${ch === 'general' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Hash size={16} />
                  <span className="text-sm font-medium">{ch}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reports</h3>
            <div className="space-y-1">
              {[ 'Monthly Stats', 'User Growth'].map((dm) => (
                <button key={dm} className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{dm}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <User size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">{username}</p>
              <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl relative">
        <header className="h-16 px-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-1">
              <Hash size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">#general</h2>
              <p className="text-xs text-gray-500 truncate">The default channel for everything</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Search size={20} className="hover:text-blue-600 cursor-pointer" />
            <div className="h-4 w-px bg-gray-200" />
            <MoreVertical size={20} className="hover:text-blue-600 cursor-pointer" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gray-50/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <MessageSquare size={32} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">No messages yet. Be the first to start!</p>
            </div>
          )}

          {messages.map((msg, idx) => {
            const isLocal = msg.sender === username;
            return (
              <div key={msg.id} className={`flex ${isLocal ? 'justify-end' : 'justify-start'} group transition-all`}>
                <div className={`flex flex-col max-w-[80%] ${isLocal ? 'items-end' : 'items-start'}`}>
                  {!isLocal && (
                    <span className="text-[11px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-tight">
                      {msg.sender}
                    </span>
                  )}
                  <div
                    className={`p-3 md:p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-all ${
                      isLocal
                        ? 'bg-blue-600 text-white rounded-br-none hover:bg-blue-700'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none hover:border-blue-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-1 font-medium">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 md:p-6 bg-white border-t border-gray-100">
          <form onSubmit={sendMessage} className="max-w-5xl mx-auto relative group">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 rounded-2xl p-2 pr-3 transition-all">
              <button type="button" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message #general as ${username}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 text-gray-700 placeholder-gray-400"
              />
              <button type="button" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition sm:flex hidden">
                <Smile size={20} />
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2.5 rounded-xl transition-all shadow-md active:scale-95 ${
                  input.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 elevation-1'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
