import React, { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { TopBar, SideNav } from "./index";
import { ToastContainer } from "../ui";
import type { Category, ExhibitionTrack, VoterState } from "../../utils/dataTypes";

export interface HomeLayoutProps {
    children?: React.ReactNode;
    categories?: Category[];
    selectedCategory?: string;
    onCategoryChange?: (categoryId: string) => void;
    selectedTrack?: ExhibitionTrack;
    onTrackSelect?: (track: ExhibitionTrack) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    voterState?: VoterState;
    onOpenVoteModal?: () => void;
    totalProjects?: number;
    totalVotes?: number;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({
    children,
    searchQuery = "",
    onSearchChange = () => { },
    voterState = { matricNumber: null, isVerified: false, votedCategoryIds: [] },
    onOpenVoteModal = () => { },
    totalProjects = 0,
    totalVotes = 0,
}) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans selection:bg-primary-light selection:text-primary-dark">
            {/* Toast Notification Container */}
            <ToastContainer />

            {/* Sticky TopBar Navigation */}
            <TopBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                voterState={voterState}
                onOpenVoteModal={onOpenVoteModal}
                onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
                isMobileNavOpen={isMobileNavOpen}
                totalProjects={totalProjects}
                totalVotes={totalVotes}
            />

            {/* Main Body Layout: SideNav + Content Area */}
            <div className="fmax-w-7xl w-full flex justify-between">
                {/* Sidebar Navigation */}
                <div className="w-fit">
                    <SideNav
                        isOpenMobile={isMobileNavOpen}
                        onCloseMobile={() => setIsMobileNavOpen(false)}
                    />
                </div>
                <div className="w-full">

                    {/* Primary Content View / Outlet */}
                    <main className="flex-1 p-4 sm:p-6 w-full">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomeLayout;
