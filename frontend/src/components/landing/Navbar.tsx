import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Vote, Menu, X, Award, Layers, BarChart3, UserCheck } from "lucide-react";
import { Button, Badge } from "../ui";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105">
            <img
              src="/images/nacos-logo.png"
              alt="NACOS NSUK Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to icon if logo fails to render
                e.currentTarget.style.display = 'none';
              }}
            />
            <Vote className="w-6 h-6 text-primary absolute hidden group-err:block" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-navy tracking-tight group-hover:text-primary transition-colors">
                NACOS NSUK
              </span>
              <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                Exhibition 2026
              </Badge>
            </div>
            <p className="text-xs text-text-muted font-medium">Nasarawa State University, Keffi</p>
          </div>
        </Link>

        {/* Desktop Quick Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-text-secondary">
          <a
            href="/home"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-text-muted" />
            Projects
          </a>
          <a
            href="/results"
            className="hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-text-muted" />
            Live Leaderboard
          </a>
          <a
            href="/home/judge-login"
            className="hover:text-navy transition-colors flex items-center gap-1.5 text-navy font-bold"
          >
            <UserCheck className="w-4 h-4 text-navy" />
            Judges Portal
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Vote className="w-4 h-4" />}
            onClick={() => {
              const el = document.getElementById("projects-grid");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Vote Now
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-navy hover:bg-surface transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-text-secondary">
            <a
              href="#projects-grid"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-background hover:text-primary transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-text-muted" />
              Projects Grid
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-background hover:text-primary transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-text-muted" />
              Exhibition Categories
            </a>
            <a
              href="#leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-background hover:text-primary transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-text-muted" />
              Real-Time Leaderboard
            </a>
            <a
              href="#judge-login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-background hover:text-navy transition-colors flex items-center gap-2 text-navy font-bold"
            >
              <UserCheck className="w-4 h-4 text-navy" />
              Judges Portal
            </a>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Vote className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById("projects-grid");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Cast Vote
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
