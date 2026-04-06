import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 py-12 px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 mb-12 transition-all">
        <ArrowLeft size={18} /> Back to Home
      </Link>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
          <ShieldCheck size={24} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      </div>

      <div className="prose prose-blue max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information you provide directly to us when you create or modify your account. This includes your name, email address, password, and profile picture.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. How We Use Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use the information we collect to provide, maintain, and improve our services, develop new services, and protect SocketChat and our users.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We use industry-standard measures to protect your information, including end-to-end encryption for real-time messages and hashing for sensitive data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">4. Sharing Your Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We do not share your personal information with third parties except as necessary to provide our services or comply with legal obligations.
          </p>
        </section>
      </div>

      <footer className="mt-20 pt-8 border-t border-gray-100 text-sm text-gray-500">
        Last updated: April 6, 2026
      </footer>
    </div>
  );
}
