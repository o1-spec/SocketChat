import Link from 'next/link';
import { ArrowLeft, ScrollText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 py-12 px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 mb-12 transition-all">
        <ArrowLeft size={18} /> Back to Home
      </Link>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
          <ScrollText size={24} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
      </div>

      <div className="prose prose-blue max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using SocketChat, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">2. Use of Service</h2>
          <p className="text-gray-600 leading-relaxed">
            You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, followers, username, or any account rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">3. Content Ownership</h2>
          <p className="text-gray-600 leading-relaxed">
            You retain all rights to any content you submit, post or display on or through the Service. By submitting, posting or displaying content, you grant SocketChat a worldwide, non-exclusive, royalty-free license.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">4. Termination</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify or terminate the Service or your access to the Service for any reason, without notice, at any time, and without liability to you.
          </p>
        </section>
      </div>

      <footer className="mt-20 pt-8 border-t border-gray-100 text-sm text-gray-500">
        Last updated: April 6, 2026
      </footer>
    </div>
  );
}
