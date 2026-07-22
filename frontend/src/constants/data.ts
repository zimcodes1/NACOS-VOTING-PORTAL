import type { Category, ExhibitionTrack, NavItem, ExhibitionStat } from "../utils/dataTypes";

export const EXHIBITION_CATEGORIES: Category[] = [
  {
    id: "all",
    name: "All Projects",
    slug: "all",
    description: "Browse all entries submitted to the NACOS Software Exhibition",
    requires_payment: false,
    fee_amount: 0,
    project_count: 12,
    icon_name: "Grid",
  },
  {
    id: "software-dev",
    name: "Software Development",
    slug: "software-dev",
    description: "Web apps, mobile solutions, APIs, and backend architectures",
    requires_payment: true,
    fee_amount: 300000, // 3000 NGN in kobo
    project_count: 5,
    icon_name: "Code2",
  },
  {
    id: "graphic-design",
    name: "Graphic & UI/UX Design",
    slug: "graphic-design",
    description: "Brand identities, UI mockups, posters, and vector illustrations",
    requires_payment: false,
    fee_amount: 0,
    project_count: 4,
    icon_name: "Palette",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity & Tools",
    slug: "cybersecurity",
    description: "Security utilities, scanner scripts, and identity management",
    requires_payment: true,
    fee_amount: 300000,
    project_count: 1,
    icon_name: "ShieldCheck",
  },
];

export const NAV_ITEMS: NavItem[] = [
  {
    id: "exhibition-grid",
    label: "Project Discovery",
    href: "/home",
    iconName: "LayoutGrid",
  },
  {
    id: "categories",
    label: "Categories",
    href: "/home#categories",
    iconName: "FolderKanban",
    badge: 4,
  },
  {
    id: "leaderboard",
    label: "Live Leaderboard",
    href: "/dashboard", // TV / Venue leaderboard route
    iconName: "Trophy",
    badge: "LIVE",
  },
  {
    id: "register",
    label: "Register Project",
    href: "/register",
    iconName: "PlusCircle",
  },
  {
    id: "rules",
    label: "Exhibition Rules",
    href: "/rules",
    iconName: "FileText",
  },
];

export const TRACK_FILTERS: { id: ExhibitionTrack; label: string; count: number }[] = [
  { id: "all", label: "All Tracks", count: 12 },
  { id: "software", label: "Software Track", count: 8 },
  { id: "graphic_design", label: "Design Track", count: 4 },
];

export const SORT_OPTIONS: { id: "popular" | "newest" | "title"; label: string }[] = [
  { id: "popular", label: "Most Voted" },
  { id: "newest", label: "Recently Submitted" },
  { id: "title", label: "Alphabetical (A-Z)" },
];

export const EXHIBITION_STATS: ExhibitionStat[] = [
  {
    label: "Exhibition Projects",
    value: "12",
    change: "+3 today",
    iconName: "FolderGit2",
  },
  {
    label: "Total Votes Cast",
    value: "1,284",
    change: "Live updates",
    iconName: "CheckCheck",
  },
  {
    label: "Participating Teams",
    value: "10",
    change: "NSUK Dept of CS",
    iconName: "Users",
  },
  {
    label: "Voting Status",
    value: "OPEN",
    change: "Closes 6:00 PM",
    iconName: "Clock",
  },
];
