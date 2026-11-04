import { Link } from 'react-router-dom';
import {
  Shield, MapPin, Mail, Clock, Phone, ArrowRight,
  Search, CheckCircle2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/40 bg-emerald-950 text-white">
      {/* Top Banner / Community Highlight */}
      <div className="border-b border-emerald-900/60 bg-emerald-900/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-4 text-xs sm:flex-row lg:px-8">
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Official ASTU Campus Lost and Found Platform</span>
          </div>
          <div className="flex items-center gap-6 text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Office Hours: Mon – Fri, 8:00 AM – 5:30 PM
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <MapPin className="h-3.5 w-3.5" />
              ASTU Main Campus, Adama
            </span>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md transition group-hover:scale-105 group-hover:bg-emerald-700">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  FindBack
                </h3>
                <p className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                  ASTU Lost & Found
                </p>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-emerald-100/80">
              A trusted university platform connecting students, faculty, and campus staff to report, identify, and return lost belongings safely and respectfully.
            </p>

            <div className="pt-2">
              <Link
                to="/registration"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-800/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 hover:shadow-md"
              >
                <span>Join ASTU Network</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Explore Directory
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/90 font-medium">
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
              <li>
                <Link to="/report-item" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Report Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Actions & Student Help */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Student Services
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/90 font-medium">
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
              <li>
                <Link to="/about" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Verification Guidelines
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-white hover:translate-x-1 inline-block">
                  Student Login Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ASTU Location & Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Campus Drop-off & Support
            </h4>
            <div className="space-y-3 text-xs text-emerald-100/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  Adama Science and Technology University, Central Library & Campus Security Office
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="hover:text-white transition">
                  lostandfound@astu.edu.et
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Ext. 2045 / Campus Emergency</span>
              </div>
              <div className="mt-3 rounded-xl border border-emerald-800/80 bg-emerald-900/40 p-3 text-[11px] text-emerald-200">
                <Shield className="inline h-3.5 w-3.5 text-emerald-400 mr-1.5 mb-0.5" />
                Evidence & identifying proof remain strictly private to protect student ownership.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Terms */}
      <div className="border-t border-emerald-900/60 bg-emerald-950/90">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-emerald-300/80 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} University FindBack. ASTU. All rights reserved.</p>
          <p className="italic text-emerald-200">
            Together, keeping our ASTU community connected.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition">
              About FindBack
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition">
              Contact & Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
