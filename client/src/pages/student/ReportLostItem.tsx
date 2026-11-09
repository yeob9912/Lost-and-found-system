import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LostItemForm from '../../components/lost-items/LostItemForm';

export default function ReportLostItem() {
  return (
    <div className="min-h-screen bg-[#f7faf7] flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6">
            <Link
              to="/lost-items"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
            >
              <ArrowLeft size={15} /> Back to Lost Items
            </Link>
          </div>
          <LostItemForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}

