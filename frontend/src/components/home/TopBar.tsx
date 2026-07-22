import React from "react";
import { Search, Sparkles, UserCheck, Menu, X, ShieldCheck, Trophy, Flame } from "lucide-react";
import { Badge, Button } from "../ui";
import { type VoterState } from "../../utils/dataTypes";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  voterState: VoterState;
  onOpenVoteModal: () => void;
  onToggleMobileNav: () => void;
  isMobileNavOpen: boolean;
  totalProjects: number;
  totalVotes: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  voterState,
  onOpenVoteModal,
  onToggleMobileNav,
  isMobileNavOpen,
  totalProjects,
  totalVotes,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Menu Button & Brand Badge */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-navy hover:bg-background transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="items-center gap-2.5 hidden sm:flex">
              <div className="w-10 h-10 rounded-2xl bg-white border border-border p-1 flex items-center justify-center text-white shadow-md shadow-primary/20">
                <img src="/images/nacos-logo.png" alt="" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-navy leading-tight tracking-tight">
                    NACOS Software Exhibition
                  </span>
                  <Badge variant="primary" size="sm" pulse>
                    LIVE
                  </Badge>
                </div>
                <p className="text-xs text-text-muted">NSUK Dept. of Computer Science</p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search projects, technologies, team members..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-background border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-muted hover:text-navy transition-colors rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Stats & Voter Matric Badge */}
          <div className="flex items-center gap-3">
            {/* Quick Metrics (Desktop) */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-text-secondary bg-background px-3 py-1.5 rounded-xl border border-border">
              <span className="flex items-center gap-1 text-primary">
                <Flame className="w-3.5 h-3.5" />
                {totalProjects} Entries
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1 text-gold-dark">
                <Trophy className="w-3.5 h-3.5 text-gold" />
                {totalVotes} Votes
              </span>
            </div>

            {/* Voter Authentication / Verification Status */}
            {voterState.isVerified && voterState.matricNumber ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="success"
                  size="md"
                  icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  className="hidden sm:inline-flex"
                >
                  {voterState.matricNumber}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<UserCheck className="w-4 h-4 text-primary" />}
                  onClick={onOpenVoteModal}
                >
                  Voter Status
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                onClick={onOpenVoteModal}
              >
                Verify Matric
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
