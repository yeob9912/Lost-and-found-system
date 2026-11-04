import { Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/50 bg-emerald-950 text-white">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">

          {/* Brand & Purpose (5 cols on md+) */}
          <div className="space-y-3.5 md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md transition group-hover:scale-105 group-hover:bg-emerald-700">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white">
                  FindBack
                </h3>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
                  ASTU Lost & Found
                </p>
              </div>
            </Link>

            <p className="max-w-md text-xs leading-relaxed text-emerald-100/75">
              A university platform designed to connect students and faculty across ASTU to report, track, and return lost campus belongings safely.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-300/90 pt-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Official ASTU Campus Lost and Found Platform</span>
            </div>
          </div>

          {/* Quick Navigation (4 cols on md+) */}
          <div className="md:col-span-4 md:pl-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Explore Directory
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              <li>
                <Link to="/" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/lost-items" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Lost Items Directory
                </Link>
              </li>
              <li>
                <Link to="/found-items" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Found Items Registry
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white hover:translate-x-1 inline-block">
                  About FindBack
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Actions (3 cols on md+) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Student Services
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              <li>
                <Link to="/report-item" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-item" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link to="/registration" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Submit Ownership Claim
                </Link>
              </li>
            </ul>

            <div className="pt-4">
              <Link
                to="/registration"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-800/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 hover:shadow-md"
              >
                <span>Join ASTU Network</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Compact Bottom Bar */}
      <div className="border-t border-emerald-900/60 bg-emerald-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 text-xs text-emerald-300/80 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} University FindBack. ASTU. All rights reserved.</p>
          <p className="italic text-emerald-200/80 text-[11px]">
            Together, keeping our ASTU community connected.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
