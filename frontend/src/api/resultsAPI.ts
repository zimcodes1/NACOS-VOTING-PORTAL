import apiCall from "./apiCall";
import type { LiveCategoryResult, JudgedCategoryResult } from "../utils/dataTypes";

/**
 * GET /api/results/live/
 * Fetches live public voting category results for design and AI prompting tracks.
 */
export async function fetchLiveResults(): Promise<LiveCategoryResult[]> {
  try {
    const data = await apiCall<{ categories: LiveCategoryResult[] }>({
      url: "results/live/",
      method: "GET",
    });
    return data?.categories || [];
  } catch (error) {
    console.warn("fetchLiveResults API call failed:", error);
    throw error;
  }
}

/**
 * POST /api/results/judged/
 * Submits secret unlock code (e.g. 'evolve') to reveal Software Track judge standings.
 */
export async function unlockJudgedResults(
  code: string
): Promise<{ unlocked: boolean; categories?: JudgedCategoryResult[]; error?: string }> {
  try {
    const data = await apiCall<{
      unlocked: boolean;
      message?: string;
      categories?: JudgedCategoryResult[];
    }>({
      url: "results/judged/",
      method: "POST",
      data: { code },
    });
    return {
      unlocked: data.unlocked,
      categories: data.categories || [],
    };
  } catch (error: any) {
    const errData = error?.response?.data;
    const errorMsg = errData?.error || "Invalid secret code. Failed to unlock Software Track results.";
    return { unlocked: false, error: errorMsg };
  }
}
