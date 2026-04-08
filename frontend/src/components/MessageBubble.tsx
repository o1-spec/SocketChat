import { ImageIcon, File, Download } from 'lucide-react';

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

interface MessageBubbleProps {
  message: Message;
  isLocal: boolean;
  backendUrl: string;
}

export default function MessageBubble({ message, isLocal, backendUrl }: MessageBubbleProps) {
  return (
    <div className={`flex ${isLocal ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isLocal ? 'items-end' : 'items-start'}`}>
        {!isLocal && (
          <div className="flex items-center gap-2 mb-2 ml-1">
            <div className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
              {message.sender.charAt(0).toUpperCase()}
            </div>
            <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              {message.sender}
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
          {message.text}
          {message.file && (
            <div className={`mt-3 p-3 rounded-2xl flex flex-col gap-3 border ${
              isLocal ? 'bg-blue-500/50 border-blue-400 text-white' : 'bg-gray-50 border-gray-100 text-gray-700'
            }`}>
              {message.file.type.startsWith('image/') ? (
                <div className="relative group/img overflow-hidden rounded-xl bg-black/5 aspect-video flex items-center justify-center">
                  <img 
                    src={`${backendUrl}${message.file.url}`} 
                    alt={message.file.name}
                    className="max-w-full max-h-64 object-contain transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <File size={20} className={isLocal ? 'text-blue-100' : 'text-gray-400'} />
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-xs font-bold truncate`}>
                      {message.file.name}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-1">
                <span className="text-[10px] font-medium opacity-70 truncate max-w-37.5">
                  {message.file.name}
                </span>
                <a 
                  href={`${backendUrl}${message.file.url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-xl transition-colors flex items-center gap-2 text-[10px] font-bold ${
                    isLocal ? 'hover:bg-blue-400 bg-blue-400/30' : 'hover:bg-gray-200 bg-gray-200/50 text-gray-500'
                  }`}
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
        <span className={`text-[10px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest ${isLocal ? 'mr-2' : 'ml-8'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
