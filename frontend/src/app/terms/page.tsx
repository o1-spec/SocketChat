import Link from 'next/link';
import { ArrowLeft, ScrollText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ScrollText size={18} className="text-white" />
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
              <ScrollText size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Terms of Service</h1>
          </div>

          <div className="prose prose-blue max-w-none space-y-10">
            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <h2 className="text-xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                By accessing or using SocketChat, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>

            <section className="p-2">
              <h2 className="text-xl font-bold mb-4 text-gray-900">2. Use of Service</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, followers, username, or any account rights.
              </p>
            </section>

            <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
              <h2 className="text-xl font-bold mb-4 text-gray-900">3. Content Ownership</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                You retain all rights to any content you submit, post or display on or through the Service. By submitting, posting or displaying content, you grant SocketChat a worldwide, non-exclusive, royalty-free license.
              </p>
            </section>

            <section className="p-2">
              <h2 className="text-xl font-bold mb-4 text-gray-900">4. Termination</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                We reserve the right to modify or terminate the Service or your access to the Service for any reason, without notice, at any time, and without liability to you.
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
