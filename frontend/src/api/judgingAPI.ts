import apiCall from "./apiCall";
import type { Judge, JudgeDashboardData } from "../utils/dataTypes";

/**
 * POST /api/judge/login/
 * Authenticates the judge user and returns their profile details.
 */
export async function loginJudge(
  username: string,
  password: string
): Promise<{ success: boolean; judge?: Judge; error?: string }> {
  try {
    const data = await apiCall<{ message: string; judge: any }>({
      url: "judge/login/",
      method: "POST",
      data: { username, password },
    });
    return {
      success: true,
      judge: {
        ...data.judge,
        id: String(data.judge.id),
      },
    };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.error || "Login failed. Please check your credentials.";
    return { success: false, error: errorMsg };
  }
}

/**
 * POST /api/judge/logout/
 * Destroys the authenticated session on the backend.
 */
export async function logoutJudge(): Promise<{ success: boolean; error?: string }> {
  try {
    await apiCall<any>({
      url: "judge/logout/",
      method: "POST",
    });
    return { success: true };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.error || "Logout failed.";
    return { success: false, error: errorMsg };
  }
}

/**
 * GET /api/judge/session/
 * Checks if the judge is currently logged in.
 */
export async function checkJudgeSession(): Promise<{ authenticated: boolean; judge?: Judge }> {
  try {
    const data = await apiCall<{ authenticated: boolean; judge?: any }>({
      url: "judge/session/",
      method: "GET",
    });
    if (data.authenticated && data.judge) {
      return {
        authenticated: true,
        judge: {
          ...data.judge,
          id: String(data.judge.id),
        },
      };
    }
    return { authenticated: false };
  } catch (error) {
    console.warn("checkJudgeSession API call failed:", error);
    return { authenticated: false };
  }
}

/**
 * GET /api/judge/dashboard-data/
 * Fetches judge profile, assigned categories, criteria, projects, and score entries.
 */
export async function fetchJudgeDashboardData(judgeId?: string): Promise<JudgeDashboardData | null> {
  try {
    const data = await apiCall<any>({
      url: "judge/dashboard-data/",
      method: "GET",
      params: judgeId ? { judge_id: judgeId } : undefined,
    });
    if (!data || !data.judge) return null;

    return {
      judge: {
        ...data.judge,
        id: String(data.judge.id),
      },
      categories: (data.categories || []).map((cat: any) => ({
        ...cat,
        id: String(cat.id),
        criteria: (cat.criteria || []).map((c: any) => ({ ...c, id: String(c.id) })),
        projects: (cat.projects || []).map((p: any) => ({
          ...p,
          id: String(p.id),
          category_id: String(p.category_id || p.category?.id || ""),
          scores: (p.scores || []).map((s: any) => ({
            ...s,
            id: String(s.id),
            project_id: String(s.project_id || p.id),
            criterion_id: String(s.criterion_id),
          })),
        })),
      })),
    };
  } catch (error) {
    console.warn("fetchJudgeDashboardData API call failed:", error);
    return null;
  }
}

/**
 * POST /api/judge/save-scores/
 * Saves draft criteria scores for a project.
 */
export async function saveProjectScores(
  projectId: string,
  scores: Array<{ criterion_id: string; value: number }>,
  judgeId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiCall<any>({
      url: "judge/save-scores/",
      method: "POST",
      data: {
        project_id: projectId,
        scores: scores.map((s) => ({ criterion_id: s.criterion_id, value: s.value })),
        judge_id: judgeId,
      },
    });
    return { success: true };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.error || "Failed to save draft scores.";
    return { success: false, error: errorMsg };
  }
}

/**
 * POST /api/judge/submit-category-scores/
 * Finalizes and submits all project evaluation scores in a category.
 */
export async function submitCategoryScores(
  categoryId: string,
  judgeId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await apiCall<any>({
      url: "judge/submit-category-scores/",
      method: "POST",
      data: {
        category_id: categoryId,
        judge_id: judgeId,
      },
    });
    return { success: true };
  } catch (error: any) {
    const errData = error.response?.data;
    const errorMsg = errData?.error || "Failed to submit category scores.";
    return { success: false, error: errorMsg };
  }
}
