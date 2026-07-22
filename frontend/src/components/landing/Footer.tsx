import React from "react";
import { Link } from "@tanstack/react-router";
import { Vote, ExternalLink, Layers, BarChart3, UserCheck, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-navy text-white border-t border-border/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand & Organization */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 backdrop-blur-md transition-transform group-hover:scale-105">
                <img
                  src="/images/nacos-logo.png"
                  alt="NACOS NSUK Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <Vote className="w-6 h-6 text-primary absolute hidden group-err:block" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-primary transition-colors block">
                  NACOS NSUK
                </span>
                <p className="text-xs text-slate-300 font-medium">Software Exhibition 2026</p>
              </div>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed">
              Official Voting & Evaluation Portal for Nasarawa State University Keffi NACOS Chapter. Promoting tech innovation, transparency, and peer recognition.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-gold-light font-semibold">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>100% Transparent Audience & Jury Voting</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Exhibition Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-primary transition-colors flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  Live Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Portals & Actions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  Public Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Vote className="w-3.5 h-3.5 text-slate-400" />
                  Register Exhibition Project
                </Link>
              </li>
              <li>
                <Link to="/home/judge-login" className="hover:text-gold transition-colors flex items-center gap-2 font-semibold text-slate-200">
                  <UserCheck className="w-3.5 h-3.5 text-gold" />
                  Judges Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* University & Institutional Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Institution
            </h4>
            <div className="text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Department of Computer Science</p>
              <p>Faculty of Natural & Applied Sciences</p>
              <p>Nasarawa State University, Keffi (NSUK)</p>
              <div className="pt-2">
                <a
                  href="https://nsuk.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:text-primary-light transition-colors font-semibold"
                >
                  <span>NSUK Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NACOS NSUK Chapter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
