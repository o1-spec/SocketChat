import Link from 'next/link';
import { MessageSquare, Shield, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  const isAuthenticated = false;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">SocketChat</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                Sign in
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition shadow-sm active:scale-95"
              >
                Get Started
              </Link>
            </>
          ) : (
            <Link 
              href="/chat" 
              className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-500 transition shadow-sm active:scale-95"
            >
              Go to Chat
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8 bg-linear-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10 mb-8 bg-blue-50/50">
              Now with end-to-end encryption
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect instantly with <br /><span className="text-blue-600">SocketChat</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A lightning-fast, secure, and modern messaging platform. Built for developers who value real-time performance and beautiful design.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={isAuthenticated ? "/chat" : "/register"}
                className="rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Chatting"} <ArrowRight size={18} />
              </Link>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 sm:py-32 bg-white scroll-mt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-bold leading-7 text-blue-600 uppercase tracking-widest">Premium Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Real-time communication, <span className="text-blue-600">reimagined.</span>
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: "Real-time Engine",
                  icon: Zap,
                  desc: "Powered by Socket.IO for sub-millisecond latency and reliable message delivery across all devices."
                },
                {
                  title: "Secure by Default",
                  icon: Shield,
                  desc: "Industrial grade security with JWT authentication and persistent storage using PostgreSQL and Redis."
                },
                {
                  title: "Rich Features",
                  icon: MessageSquare,
                  desc: "Support for channels, direct messages, file sharing, and typing indicators out of the box."
                }
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col items-start p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-1 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-blue-600 transition-colors">
                    <feature.icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <dt className="text-lg font-bold leading-7 text-gray-900 mb-2">
                    {feature.title}
                  </dt>
                  <dd className="text-base leading-7 text-gray-600">
                    {feature.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
