import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveResults, unlockJudgedResults } from "../../api/resultsAPI";
import { ResultsPage } from "../../pages/home/ResultsPage";
import { toast } from "../../components/ui/Toast";
import type { LiveCategoryResult, JudgedCategoryResult } from "../../utils/dataTypes";

export const ResultsContainer: React.FC = () => {
  // Unlock state for Software Track
  const [unlockCode, setUnlockCode] = useState<string>("");
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isJudgedUnlocked, setIsJudgedUnlocked] = useState<boolean>(false);
  const [judgedCategories, setJudgedCategories] = useState<JudgedCategoryResult[]>([]);

  // TanStack Query for 3-second HTTP polling of public tracks
  const {
    data: liveCategories = [],
    isLoading: isLoadingLive,
    isError: isErrorLive,
    isFetching: isFetchingLive,
    error: queryError,
  } = useQuery<LiveCategoryResult[]>({
    queryKey: ["liveResults"],
    queryFn: () => fetchLiveResults(),
    refetchInterval: 3000,
    retry: 2,
  });

  // Connection loss / error notification
  useEffect(() => {
    if (isErrorLive && queryError) {
      toast.warning("Live Telemetry Interrupted", {
        description: "Reconnecting to live results stream...",
      });
    }
  }, [isErrorLive, queryError]);

  // Handle secret code unlock form submit
  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockCode.trim()) {
      toast.error("Unlock Code Required", {
        description: "Please enter the announcement code (e.g. evolve).",
      });
      return;
    }

    setIsUnlocking(true);
    const res = await unlockJudgedResults(unlockCode.trim());
    setIsUnlocking(false);

    if (res.unlocked && res.categories) {
      setIsJudgedUnlocked(true);
      setJudgedCategories(res.categories);
      toast.gold("Software Track Results Unlocked!", {
        description: "Official aggregate standings and category champions revealed.",
      });
    } else {
      toast.error("Invalid Unlock Code", {
        description: res.error || "Please check the secret code and try again.",
      });
    }
  };

  return (
    <ResultsPage
      liveCategories={liveCategories}
      isLoadingLive={isLoadingLive}
      isErrorLive={isErrorLive}
      isFetchingLive={isFetchingLive}
      unlockCode={unlockCode}
      onUnlockCodeChange={setUnlockCode}
      onUnlockSubmit={handleUnlockSubmit}
      isUnlocking={isUnlocking}
      isJudgedUnlocked={isJudgedUnlocked}
      judgedCategories={judgedCategories}
    />
  );
};

export default ResultsContainer;
