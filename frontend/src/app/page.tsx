import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-8">
        <h1 className="text-6xl font-bold text-blue-600">SocketChat</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          A real-time messaging platform built with Next.js, Node.js, and Socket.IO.
        </p>
        <div className="flex space-x-4">
          <Link 
            href="/chat"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Chatting
          </Link>
        </div>
      </div>
    </main>
  );
}
