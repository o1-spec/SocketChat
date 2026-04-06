import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-900">SocketChat</span>
        </div>
        <Link href="/" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-all flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full py-12 px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-blue max-w-none space-y-10">
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <h2 className="text-xl font-bold mb-4 text-gray-900">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                We collect information you provide directly to us when you create or modify your account. This includes your name, email address, password, and profile picture.
              </p>
            </section>

            <section className="p-2">
              <h2 className="text-xl font-bold mb-4 text-gray-900">2. How We Use Information</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                We use the information we collect to provide, maintain, and improve our services, develop new services, and protect SocketChat and our users.
              </p>
            </section>

            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <h2 className="text-xl font-bold mb-4 text-gray-900">3. Data Security</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                We use industry-standard measures to protect your information, including end-to-end encryption for real-time messages and hashing for sensitive data.
              </p>
            </section>

            <section className="p-2">
              <h2 className="text-xl font-bold mb-4 text-gray-900">4. Sharing Your Information</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                We do not share your personal information with third parties except as necessary to provide our services or comply with legal obligations.
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-400 font-bold uppercase tracking-widest text-center">
            Last updated: April 6, 2026
          </footer>
        </div>
      </main>
    </div>
  );
}
