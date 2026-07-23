import type { Category, ExhibitionTrack, NavItem, ExhibitionStat } from "../utils/dataTypes";
import {
    Swords,
    Cpu,
    Gamepad2,
    Sparkles,
    Crown,
    Code2,
    Laptop,
    Terminal,
    Trophy,
    Award,
    Lightbulb,
    Rocket,
    Zap,
    Flame,
    Star,
} from "lucide-react";

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

//Icons for the background of NACOS Timeline Section
export const bgDecoIcons = [
        { icon: Code2, top: "3%", left: "4%", rotate: -25, size: "w-10 h-10", delay: 0 },
        { icon: Trophy, top: "8%", right: "5%", rotate: 18, size: "w-12 h-12", delay: 1 },
        { icon: Gamepad2, top: "20%", left: "6%", rotate: 42, size: "w-14 h-14", delay: 0.5 },
        { icon: Swords, top: "30%", right: "7%", rotate: -35, size: "w-11 h-11", delay: 1.5 },
        { icon: Crown, top: "42%", left: "3%", rotate: 15, size: "w-12 h-12", delay: 0.8 },
        { icon: Rocket, top: "54%", right: "4%", rotate: -18, size: "w-10 h-10", delay: 2 },
        { icon: Terminal, top: "66%", left: "5%", rotate: 30, size: "w-12 h-12", delay: 1.2 },
        { icon: Award, top: "78%", right: "6%", rotate: -40, size: "w-14 h-14", delay: 0.3 },
        { icon: Lightbulb, top: "88%", left: "4%", rotate: 22, size: "w-10 h-10", delay: 1.7 },
        { icon: Sparkles, top: "96%", right: "5%", rotate: -12, size: "w-11 h-11", delay: 0.9 },
        { icon: Zap, top: "15%", right: "12%", rotate: -50, size: "w-8 h-8", delay: 1.1 },
        { icon: Laptop, top: "49%", right: "12%", rotate: 28, size: "w-10 h-10", delay: 0.4 },
        { icon: Flame, top: "73%", left: "10%", rotate: -15, size: "w-9 h-9", delay: 1.8 },
        { icon: Star, top: "37%", left: "11%", rotate: 60, size: "w-8 h-8", delay: 1.3 },
        { icon: Code2, top: "12%", left: "22%", rotate: 14, size: "w-9 h-9", delay: 0.6 },
        { icon: Trophy, top: "25%", right: "20%", rotate: -22, size: "w-10 h-10", delay: 1.4 },
        { icon: Gamepad2, top: "45%", left: "18%", rotate: -45, size: "w-12 h-12", delay: 0.2 },
        { icon: Swords, top: "18%", left: "35%", rotate: 33, size: "w-8 h-8", delay: 1.9 },
        { icon: Crown, top: "62%", right: "22%", rotate: -12, size: "w-11 h-11", delay: 0.7 },
        { icon: Rocket, top: "82%", left: "15%", rotate: 48, size: "w-10 h-10", delay: 1.1 },
        { icon: Terminal, top: "35%", right: "30%", rotate: -28, size: "w-9 h-9", delay: 1.6 },
        { icon: Award, top: "58%", left: "28%", rotate: 25, size: "w-12 h-12", delay: 0.4 },
        { icon: Lightbulb, top: "5%", right: "32%", rotate: -38, size: "w-8 h-8", delay: 2.1 },
        { icon: Sparkles, top: "91%", right: "25%", rotate: 19, size: "w-10 h-10", delay: 0.8 },
        { icon: Zap, top: "68%", right: "15%", rotate: 40, size: "w-9 h-9", delay: 1.3 },
        { icon: Laptop, top: "85%", right: "38%", rotate: -20, size: "w-11 h-11", delay: 0.5 },
        { icon: Flame, top: "22% ", left: "26%", rotate: 55, size: "w-8 h-8", delay: 1.7 },
        { icon: Star, top: "50%", left: "40%", rotate: -15, size: "w-10 h-10", delay: 1.0 }
    ];

export const events = [
        {
            day: "Monday",
            date: "3rd August",
            title: "Debate & Intellectual Contest",
            description:
                "Brain-wracking debates, intellectual showdowns, and algorithmic quiz competitions among top departmental scholars.",
            icon: Swords,
            isSpotlight: false,
            tag: "Day 1",
        },
        {
            day: "Tuesday",
            date: "4th August",
            title: "Tech Summit & Industry Connect",
            description:
                "Keynotes from industry leaders, tech founders, career workshops, and networking sessions with tech sponsors.",
            icon: Cpu,
            isSpotlight: false,
            tag: "Day 2",
        },
        {
            day: "Wednesday",
            date: "5th August",
            title: "Sports & Games Day",
            description:
                "E-sports tournaments, FIFA & Tekken battles, outdoor football matches, track athletics, and recreational games.",
            icon: Gamepad2,
            isSpotlight: false,
            tag: "Day 3",
        },
        {
            day: "Thursday",
            date: "6th August",
            title: "Software Exhibition & Innovation",
            description:
                "The flagship portal event! Student project presentations, live audience voting, graphic design showcases, and expert judging evaluation.",
            icon: Sparkles,
            isSpotlight: true, // Spotlight event for this portal
            tag: "Spotlight Event",
        },
        {
            day: "Friday",
            date: "7th August",
            title: "Pageantry & Award Night",
            description:
                "The grand finale! Red carpet glam, Mr & Miss NACOS crowning, excellence award presentations, and celebration dinner.",
            icon: Crown,
            isSpotlight: false,
            tag: "Day 5 • Finale",
        },
    ];