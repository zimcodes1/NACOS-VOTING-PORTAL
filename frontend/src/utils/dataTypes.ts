
export type ProjectStatus = "pending_payment" | "paid" | "confirmed";

export type ExhibitionTrack = "software" | "graphic_design" | "ai_prompting" | "all";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  requires_payment: boolean;
  fee_amount: number; // in Kobo or Naira
  project_count: number;
  icon_name?: string;
  track?: ExhibitionTrack;
  voting_open?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  github?: string;
  linkedin?: string;
}

export interface Project {
  id: string;
  registration_code: string; // e.g., "NSE26-0001"
  title: string;
  tagline: string;
  description: string;
  thumbnail_url: string;
  live_preview_url?: string;
  category_id: string;
  category_name: string;
  category?: Category | { id: string | number; name?: string };
  track: ExhibitionTrack;
  team_name: string;
  team_members: TeamMember[];
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  show_contact_publicly: boolean;
  registration_status: ProjectStatus;
  vote_count: number;
  created_at: string;
  featured?: boolean;
  tags?: string[];
}

export interface FilterOptions {
  category: string;
  search: string;
  track: ExhibitionTrack;
  sortBy: "popular" | "newest" | "title";
}

export interface ExhibitionStat {
  label: string;
  value: string | number;
  change?: string;
  iconName: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string | number;
}

export interface VoterState {
  matricNumber: string | null;
  isVerified: boolean;
  votedCategoryIds: string[];
}

export interface DashboardProps {
  projects: Project[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  selectedTrack: ExhibitionTrack;
  sortBy: "popular" | "newest" | "title";
  isLoading?: boolean;
  voterState: VoterState;
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onTrackChange: (track: ExhibitionTrack) => void;
  onSortChange: (sortBy: "popular" | "newest" | "title") => void;
  onVote: (project: Project, matricNumber: string) => Promise<boolean> | boolean;
  onVerifyMatric: (matricNumber: string) => boolean;
  onClearMatric: () => void;
}
